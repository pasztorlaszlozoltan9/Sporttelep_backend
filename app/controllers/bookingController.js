import Booking from '../models/booking.js'
import User from '../models/user.js'
import Sport from '../models/sport.js'
import Location from '../models/location.js'
import Field from '../models/field.js'
import AvailableDate from '../models/availableDate.js'
import Prices from '../models/prices.js'
import sendEmail from '../services/email_service.js'

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
    const [sport, location, field, availableDate, price] = await Promise.all([
        booking.sportId ? Sport.findByPk(booking.sportId) : Promise.resolve(null),
        booking.locationId ? Location.findByPk(booking.locationId) : Promise.resolve(null),
        booking.fieldId ? Field.findByPk(booking.fieldId) : Promise.resolve(null),
        booking.availableDateId ? AvailableDate.findByPk(booking.availableDateId) : Promise.resolve(null),
        booking.priceId ? Prices.findByPk(booking.priceId) : Promise.resolve(null)
    ])

    return {
        sport: sport?.name,
        location: location?.name,
        locationAddress: location?.address,
        field: field?.name,
        date: booking?.date || availableDate?.date,
        startTime: booking?.startTime || availableDate?.startTime,
        price: price?.price
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
                <li><strong>Cim:</strong> ${formatText(details.locationAddress)}</li>
                <li><strong>Palya:</strong> ${formatText(details.field)}</li>
                <li><strong>Dátum:</strong> ${formatText(details.date)}</li>
                <li><strong>Kezdés:</strong> ${formatText(details.startTime)}</li>
                <li><strong>Ár:</strong> ${formatText(details.price, '-')}</li>
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
                <li><strong>ím:</strong> ${formatText(details.locationAddress)}</li>
                <li><strong>álya:</strong> ${formatText(details.field)}</li>
                <li><strong>átum:</strong> ${formatText(details.date)}</li>
                <li><strong>Kezdés:</strong> ${formatText(details.startTime)}</li>
                <li><strong>Ár:</strong> ${formatText(details.price, '-')}</li>
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
                <li><strong>ím:</strong> ${formatText(details.locationAddress)}</li>
                <li><strong>álya:</strong> ${formatText(details.field)}</li>
                <li><strong>átum:</strong> ${formatText(details.date)}</li>
                <li><strong>Kezdés:</strong> ${formatText(details.startTime)}</li>
                <li><strong>Ár:</strong> ${formatText(details.price, '-')}</li>
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
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryStore(req, res) {
        const booking = await Booking.create(req.body)
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
            let actualMessage = '';
            if(error.message == 'Fail! Record not found!') {
                actualMessage = error.message
                res.status(404)
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
        const recordNumber = await Booking.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
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
