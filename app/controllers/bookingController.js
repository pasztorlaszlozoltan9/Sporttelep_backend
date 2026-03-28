import Booking from '../models/booking.js'
import User from '../models/user.js'
import Sport from '../models/sport.js'
import Location from '../models/location.js'
import Field from '../models/field.js'
import Prices from '../models/prices.js'
import FieldBookingWindow from '../models/fieldBookingWindow.js'
import sendEmail from '../services/email_service.js'

const BOOKING_STEP_MINUTES = 15

const buildHttpError = (statusCode, message) => {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

const toInteger = (value) => {
    const parsed = Number(value)
    return Number.isInteger(parsed) ? parsed : null
}

const parseTimeToMinutes = (timeValue) => {
    const text = String(timeValue || '').trim()
    const parts = text.split(':')

    if (parts.length < 2 || parts.length > 3) {
        throw buildHttpError(400, 'Invalid startTime. Use HH:mm or HH:mm:ss format.')
    }

    const hour = toInteger(parts[0])
    const minute = toInteger(parts[1])
    const second = parts.length === 3 ? toInteger(parts[2]) : 0

    if (hour === null || minute === null || second === null) {
        throw buildHttpError(400, 'Invalid startTime. Use numeric time values.')
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
        throw buildHttpError(400, 'Invalid startTime. Time must be between 00:00:00 and 23:59:59.')
    }

    return (hour * 60) + minute
}

const normalizeTime = (timeValue) => {
    const text = String(timeValue || '').trim()
    const parts = text.split(':')
    const hour = String(toInteger(parts[0])).padStart(2, '0')
    const minute = String(toInteger(parts[1])).padStart(2, '0')
    const second = parts.length === 3 ? String(toInteger(parts[2])).padStart(2, '0') : '00'

    return `${hour}:${minute}:${second}`
}

const minutesToTimeString = (value) => {
    const hour = Math.floor(value / 60)
    const minute = value % 60
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const getWeekdayFromDate = (dateValue) => {
    const date = new Date(`${String(dateValue)}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
        throw buildHttpError(400, 'Invalid date. Use YYYY-MM-DD format.')
    }

    return date.getDay()
}

const resolveFieldDateAndTime = async (payload, existingBooking = null) => {
    const fieldId = payload.fieldId ?? existingBooking?.fieldId ?? null
    const date = payload.date ?? existingBooking?.date ?? null
    const startTime = payload.startTime ?? existingBooking?.startTime ?? null
    const endTime = payload.endTime ?? existingBooking?.endTime ?? null

    if (!fieldId) {
        throw buildHttpError(400, 'fieldId is required.')
    }

    if (!date) {
        throw buildHttpError(400, 'date is required.')
    }

    if (!startTime) {
        throw buildHttpError(400, 'startTime is required.')
    }

    if (!endTime) {
        throw buildHttpError(400, 'endTime is required.')
    }

    const startMinutes = parseTimeToMinutes(startTime)
    const endMinutes = parseTimeToMinutes(endTime)

    if (startMinutes % BOOKING_STEP_MINUTES !== 0) {
        throw buildHttpError(400, 'Invalid startTime. Start time must be in 15 minute increments.')
    }

    if (endMinutes % BOOKING_STEP_MINUTES !== 0) {
        throw buildHttpError(400, 'Invalid endTime. End time must be in 15 minute increments.')
    }

    if (endMinutes <= startMinutes) {
        throw buildHttpError(400, 'Invalid endTime. End time must be later than startTime.')
    }

    const durationMinutes = endMinutes - startMinutes

    return {
        fieldId,
        date,
        startTime: normalizeTime(startTime),
        endTime: normalizeTime(endTime),
        startMinutes,
        endMinutes,
        durationMinutes
    }
}

const resolveBasePrice = async (fieldId, preferredPriceId = null) => {
    if (preferredPriceId) {
        const selectedPrice = await Prices.findByPk(preferredPriceId)
        if (!selectedPrice) {
            throw buildHttpError(400, 'Invalid priceId. Record not found.')
        }

        if (selectedPrice.fieldId && selectedPrice.fieldId !== fieldId) {
            throw buildHttpError(400, 'Invalid priceId. Selected price does not belong to the chosen field.')
        }

        return selectedPrice
    }

    const fieldPrice = await Prices.findOne({
        where: { fieldId },
        order: [['id', 'DESC']]
    })

    if (!fieldPrice) {
        throw buildHttpError(400, 'No base price found for this field. Add a 60-minute base price first.')
    }

    return fieldPrice
}

const ensureNoBookingOverlap = async ({ fieldId, date, startMinutes, endMinutes, ignoreBookingId = null }) => {
    const existingBookings = await Booking.findAll({
        where: {
            fieldId,
            date
        }
    })

    for (const booking of existingBookings) {
        if (ignoreBookingId && Number(booking.id) === Number(ignoreBookingId)) {
            continue
        }

        const bookedStartMinutes = parseTimeToMinutes(booking.startTime)
        const bookedEndMinutes = booking.endTime
            ? parseTimeToMinutes(booking.endTime)
            : bookedStartMinutes + 60

        if (startMinutes < bookedEndMinutes && endMinutes > bookedStartMinutes) {
            throw buildHttpError(400, 'This field is already booked in the selected time range.')
        }
    }
}

const ensureWithinFieldBookingWindow = async ({ fieldId, date, startMinutes, endMinutes }) => {
    const weekday = getWeekdayFromDate(date)

    const windows = await FieldBookingWindow.findAll({
        where: {
            fieldId,
            weekday,
            isActive: 1
        }
    })

    if (!windows.length) {
        throw buildHttpError(400, 'This field cannot be booked on the selected date.')
    }

    const isInsideAnyWindow = windows.some((window) => {
        const openMinutes = parseTimeToMinutes(window.openTime)
        const closeMinutes = parseTimeToMinutes(window.closeTime)
        return startMinutes >= openMinutes && endMinutes <= closeMinutes
    })

    if (!isInsideAnyWindow) {
        throw buildHttpError(400, 'Selected time is outside field booking hours for this day.')
    }
}

const calculateTotalPrice = (basePricePerHour, durationMinutes) => {
    const amount = (Number(basePricePerHour) * Number(durationMinutes)) / 60
    return Number(amount.toFixed(2))
}

const formatText = (value, fallback = 'N/A') => {
    if (value === undefined || value === null) {
        return fallback
    }

    const text = String(value).trim()
    return text.length > 0 ? text : fallback
}

const getRecipientEmail = async (payload) => {
    if (payload?.email) {
        return String(payload.email).trim().toLowerCase()
    }

    if (!payload?.userId) {
        return null
    }

    const user = await User.findByPk(payload.userId)
    if (!user?.email) {
        return null
    }

    return String(user.email).trim().toLowerCase()
}

const resolveRecipientEmail = async (payload, booking) => {
    const fromPayload = await getRecipientEmail(payload)
    if (fromPayload) {
        return fromPayload
    }

    if (!booking?.userId) {
        return null
    }

    const user = await User.findByPk(booking.userId)
    if (!user?.email) {
        return null
    }

    return String(user.email).trim().toLowerCase()
}

const collectBookingDetails = async (booking) => {
    const [sport, location, field, price] = await Promise.all([
        booking.sportId ? Sport.findByPk(booking.sportId) : Promise.resolve(null),
        booking.locationId ? Location.findByPk(booking.locationId) : Promise.resolve(null),
        booking.fieldId ? Field.findByPk(booking.fieldId) : Promise.resolve(null),
        booking.priceId ? Prices.findByPk(booking.priceId) : Promise.resolve(null)
    ])

    const startMinutes = booking?.startTime ? parseTimeToMinutes(booking.startTime) : null
    const endMinutes = booking?.endTime ? parseTimeToMinutes(booking.endTime) : null
    const durationMinutes = (startMinutes !== null && endMinutes !== null) ? endMinutes - startMinutes : null

    return {
        sport: sport?.name,
        location: location?.name,
        locationAddress: location?.address,
        field: field?.name,
        date: booking?.date,
        startTime: booking?.startTime,
        endTime: booking?.endTime,
        durationMinutes,
        basePricePerHour: price?.price,
        totalPrice: booking?.totalPrice
    }
}

const sendBookingConfirmation = async (booking, recipientEmail) => {
    const details = await collectBookingDetails(booking)

    await sendEmail({
        email: recipientEmail,
        subject: 'Foglalás visszaigazolás - Budapest Sporttelepek',
        html: `
            <h2>Sikeres foglalás</h2>
            <p>A foglalásod sikeresen rögzítésre került.</p>
            <ul>
                <li><strong>Sport:</strong> ${formatText(details.sport)}</li>
                <li><strong>Helyszín:</strong> ${formatText(details.location)}</li>
                <li><strong>Cím:</strong> ${formatText(details.locationAddress)}</li>
                <li><strong>Pálya:</strong> ${formatText(details.field)}</li>
                <li><strong>Dátum:</strong> ${formatText(details.date)}</li>
                <li><strong>Kezdés:</strong> ${formatText(details.startTime)}</li>
                <li><strong>Befejezés:</strong> ${formatText(details.endTime)}</li>
                <li><strong>Időtartam:</strong> ${formatText(details.durationMinutes, '-')} perc</li>
                <li><strong>60 perces alapár:</strong> ${formatText(details.basePricePerHour, '-')}</li>
                <li><strong>Fizetendő:</strong> ${formatText(details.totalPrice, '-')}</li>
            </ul>
            <p>Köszönjük, hogy minket választottál!</p>
        `
    })
}

const sendBookingUpdateConfirmation = async (booking, recipientEmail) => {
    const details = await collectBookingDetails(booking)

    await sendEmail({
        email: recipientEmail,
        subject: 'Foglalás módosítva - Budapest Sporttelepek',
        html: `
            <h2>Foglalás frissítve</h2>
            <p>A foglalásod sikeresen módosítottuk.</p>
            <ul>
                <li><strong>Sport:</strong> ${formatText(details.sport)}</li>
                <li><strong>Helyszín:</strong> ${formatText(details.location)}</li>
                <li><strong>Cím:</strong> ${formatText(details.locationAddress)}</li>
                <li><strong>Pálya:</strong> ${formatText(details.field)}</li>
                <li><strong>Dátum:</strong> ${formatText(details.date)}</li>
                <li><strong>Kezdés:</strong> ${formatText(details.startTime)}</li>
                <li><strong>Befejezés:</strong> ${formatText(details.endTime)}</li>
                <li><strong>Időtartam:</strong> ${formatText(details.durationMinutes, '-')} perc</li>
                <li><strong>60 perces alapár:</strong> ${formatText(details.basePricePerHour, '-')}</li>
                <li><strong>Fizetendő:</strong> ${formatText(details.totalPrice, '-')}</li>
            </ul>
            <p>Köszönjük, hogy minket választottál!</p>
        `
    })
}

const sendBookingDeleteConfirmation = async (booking, recipientEmail) => {
    const details = await collectBookingDetails(booking)

    await sendEmail({
        email: recipientEmail,
        subject: 'Foglalás törölve - Budapest Sporttelepek',
        html: `
            <h2>Foglalás törlése sikeres</h2>
            <p>A foglalásodat töröltük.</p>
            <ul>
                <li><strong>Sport:</strong> ${formatText(details.sport)}</li>
                <li><strong>Helyszín:</strong> ${formatText(details.location)}</li>
                <li><strong>Cím:</strong> ${formatText(details.locationAddress)}</li>
                <li><strong>Pálya:</strong> ${formatText(details.field)}</li>
                <li><strong>Dátum:</strong> ${formatText(details.date)}</li>
                <li><strong>Kezdés:</strong> ${formatText(details.startTime)}</li>
                <li><strong>Befejezés:</strong> ${formatText(details.endTime)}</li>
                <li><strong>Időtartam:</strong> ${formatText(details.durationMinutes, '-')} perc</li>
                <li><strong>60 perces alapár:</strong> ${formatText(details.basePricePerHour, '-')}</li>
                <li><strong>Fizetendő:</strong> ${formatText(details.totalPrice, '-')}</li>
            </ul>
            <p>Köszönjük, hogy minket választottál!</p>
        `
    })
}

const BookingController = {
    async index(req, res) {
        try {
            await BookingController.tryIndex(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryIndex(req, res) {
        const bookings = await Booking.findAll()
        res.status(200)
        res.json({
            success: true,
            data: bookings
        })
    },
    async show(req, res) {
        try {
            await BookingController.tryShow(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryShow(req, res) {
        const booking = await Booking.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: booking
        })
    },
    async store(req, res) {
        try {
            await BookingController.tryStore(req, res)
        }catch(error) {
            res.status(error.statusCode || 500)
            res.json({
                success: false,
                message: error.statusCode ? error.message : 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryStore(req, res) {
        const resolvedWindow = await resolveFieldDateAndTime(req.body)
        const selectedPrice = await resolveBasePrice(
            resolvedWindow.fieldId,
            req.body.priceId ?? null
        )

        await ensureWithinFieldBookingWindow(resolvedWindow)
        await ensureNoBookingOverlap(resolvedWindow)

        const bookingPayload = {
            ...req.body,
            fieldId: resolvedWindow.fieldId,
            date: resolvedWindow.date,
            startTime: resolvedWindow.startTime,
            endTime: resolvedWindow.endTime,
            priceId: selectedPrice.id,
            totalPrice: calculateTotalPrice(selectedPrice.price, resolvedWindow.durationMinutes)
        }

        const booking = await Booking.create(bookingPayload)
        let emailWarning = null

        try {
            const recipientEmail = await getRecipientEmail(req.body)
            if (recipientEmail) {
                await sendBookingConfirmation(booking, recipientEmail)
            } else {
                emailWarning = 'Booking created, but no recipient email was provided.'
            }
        } catch (error) {
            emailWarning = 'Booking created, but confirmation email could not be sent.'
            console.error('Email sending failed after booking creation:', error.message)
        }

        res.status(201)
        res.json({
            success: true,
            data: booking,
            emailWarning
        })
    },
    async update(req, res) {
        try {
            await BookingController.tryUpdate(req, res)
        }catch(error) {
            let actualMessage = ''
            if(error.message == 'Fail! Record not found!') {
                actualMessage = error.message
                res.status(404)
            }else if (error.statusCode) {
                actualMessage = error.message
                res.status(error.statusCode)
            }else {
                res.status(500)
                actualMessage = 'Fail! The query is failed!'
            }
            
            res.json({
                success: false,
                message: actualMessage
            })
        }
    },
    async tryUpdate(req, res) {
        const existingBooking = await Booking.findByPk(req.params.id)
        if (!existingBooking) {
            throw new Error('Fail! Record not found!')
        }

        const resolvedWindow = await resolveFieldDateAndTime(req.body, existingBooking)
        const selectedPrice = await resolveBasePrice(
            resolvedWindow.fieldId,
            req.body.priceId ?? existingBooking.priceId ?? null
        )

        await ensureWithinFieldBookingWindow(resolvedWindow)
        await ensureNoBookingOverlap({
            ...resolvedWindow,
            ignoreBookingId: req.params.id
        })

        const updatePayload = {
            ...req.body,
            fieldId: resolvedWindow.fieldId,
            date: resolvedWindow.date,
            startTime: resolvedWindow.startTime,
            endTime: resolvedWindow.endTime,
            priceId: selectedPrice.id,
            totalPrice: calculateTotalPrice(selectedPrice.price, resolvedWindow.durationMinutes)
        }

        await Booking.update(updatePayload, {
            where: { id: req.params.id }
        })

        const booking = await Booking.findByPk(req.params.id)
        let emailWarning = null

        try {
            const recipientEmail = await resolveRecipientEmail(req.body, booking)
            if (recipientEmail) {
                await sendBookingUpdateConfirmation(booking, recipientEmail)
            } else {
                emailWarning = 'Booking updated, but no recipient email was provided.'
            }
        } catch (error) {
            emailWarning = 'Booking updated, but confirmation email could not be sent.'
            console.error('Email sending failed after booking update:', error.message)
        }

        res.status(200)
        res.json({
            success: true,
            data: booking,
            emailWarning
        })
    },
    async destroy(req, res) {
        try {
            await BookingController.tryDestroy(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryDestroy(req, res) {
        const existingBooking = await Booking.findByPk(req.params.id)
        const booking = await Booking.destroy({
            where: { id: req.params.id }
        })
        let emailWarning = null

        if (booking > 0 && existingBooking) {
            try {
                const recipientEmail = await resolveRecipientEmail(req.body, existingBooking)
                if (recipientEmail) {
                    await sendBookingDeleteConfirmation(existingBooking, recipientEmail)
                } else {
                    emailWarning = 'Booking deleted, but no recipient email was provided.'
                }
            } catch (error) {
                emailWarning = 'Booking deleted, but confirmation email could not be sent.'
                console.error('Email sending failed after booking delete:', error.message)
            }
        }

        res.status(200)
        res.json({
            success: true,
            data: booking,
            emailWarning
        })
    }
}

export default BookingController
