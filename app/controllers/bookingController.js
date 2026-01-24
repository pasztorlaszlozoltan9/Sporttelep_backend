import Booking from '../models/booking.js'

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
        res.status(201)
        res.json({
            success: true,
            data: booking
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
        res.status(200)
        res.json({
            success: true,
            data: booking
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
        const booking = await Booking.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: booking
        })
    }
}

export default BookingController
