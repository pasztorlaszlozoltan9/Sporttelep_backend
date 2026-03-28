import FieldBookingWindow from '../models/fieldBookingWindow.js'

const toInteger = (value) => {
    const parsed = Number(value)
    return Number.isInteger(parsed) ? parsed : null
}

const normalizeTime = (timeValue) => {
    const text = String(timeValue || '').trim()
    const parts = text.split(':')

    if (parts.length < 2 || parts.length > 3) {
        throw new Error('Invalid time format. Use HH:mm or HH:mm:ss.')
    }

    const hour = toInteger(parts[0])
    const minute = toInteger(parts[1])
    const second = parts.length === 3 ? toInteger(parts[2]) : 0

    if (hour === null || minute === null || second === null) {
        throw new Error('Invalid time format. Use numeric time values.')
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
        throw new Error('Invalid time value.')
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

const validatePayload = (payload) => {
    const weekday = toInteger(payload.weekday)

    if (!payload.fieldId) {
        throw new Error('fieldId is required.')
    }

    if (weekday === null || weekday < 0 || weekday > 6) {
        throw new Error('weekday must be an integer between 0 and 6 (0 = Sunday).')
    }

    if (!payload.openTime || !payload.closeTime) {
        throw new Error('openTime and closeTime are required.')
    }

    const openTime = normalizeTime(payload.openTime)
    const closeTime = normalizeTime(payload.closeTime)

    if (openTime >= closeTime) {
        throw new Error('closeTime must be later than openTime.')
    }

    let isActive = payload.isActive
    if (isActive === undefined || isActive === null) {
        isActive = 1
    } else if (isActive === true || isActive === 'true') {
        isActive = 1
    } else if (isActive === false || isActive === 'false') {
        isActive = 0
    } else {
        const parsedIsActive = toInteger(isActive)
        if (parsedIsActive === null || (parsedIsActive !== 0 && parsedIsActive !== 1)) {
            throw new Error('isActive must be 0 or 1.')
        }
        isActive = parsedIsActive
    }

    return {
        ...payload,
        weekday,
        openTime,
        closeTime,
        isActive
    }
}

const FieldBookingWindowController = {
    async index(req, res) {
        try {
            const where = {}
            if (req.query.fieldId) {
                where.fieldId = req.query.fieldId
            }

            const windows = await FieldBookingWindow.findAll({ where })
            res.status(200)
            res.json({
                success: true,
                data: windows
            })
        } catch (error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },

    async show(req, res) {
        try {
            const window = await FieldBookingWindow.findByPk(req.params.id)
            res.status(200)
            res.json({
                success: true,
                data: window
            })
        } catch (error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },

    async store(req, res) {
        try {
            const payload = validatePayload(req.body)
            const window = await FieldBookingWindow.create(payload)
            res.status(201)
            res.json({
                success: true,
                data: window
            })
        } catch (error) {
            res.status(400)
            res.json({
                success: false,
                message: error.message
            })
        }
    },

    async update(req, res) {
        try {
            const existing = await FieldBookingWindow.findByPk(req.params.id)
            if (!existing) {
                res.status(404)
                res.json({
                    success: false,
                    message: 'Fail! Record not found!'
                })
                return
            }

            const merged = {
                fieldId: req.body.fieldId ?? existing.fieldId,
                weekday: req.body.weekday ?? existing.weekday,
                openTime: req.body.openTime ?? existing.openTime,
                closeTime: req.body.closeTime ?? existing.closeTime,
                isActive: req.body.isActive ?? existing.isActive
            }

            const payload = validatePayload(merged)

            await FieldBookingWindow.update(payload, {
                where: { id: req.params.id }
            })

            const updated = await FieldBookingWindow.findByPk(req.params.id)
            res.status(200)
            res.json({
                success: true,
                data: updated
            })
        } catch (error) {
            res.status(400)
            res.json({
                success: false,
                message: error.message
            })
        }
    },

    async destroy(req, res) {
        try {
            const deleted = await FieldBookingWindow.destroy({
                where: { id: req.params.id }
            })
            res.status(200)
            res.json({
                success: true,
                data: deleted
            })
        } catch (error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    }
}

export default FieldBookingWindowController
