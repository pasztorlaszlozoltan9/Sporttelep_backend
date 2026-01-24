import AvailableDate from '../models/availableDate.js'

const AvailableDateController = {
    async index(req, res) {
        try {
            await AvailableDateController.tryIndex(req, res)
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
        const availableDates = await AvailableDate.findAll()
        res.status(200)
        res.json({
            success: true,
            data: availableDates
        })
    },
    async show(req, res) {
        try {
            await AvailableDateController.tryShow(req, res)
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
        const availableDate = await AvailableDate.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: availableDate
        })
    },
    async store(req, res) {
        try {
            await AvailableDateController.tryStore(req, res)
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
        const availableDate = await AvailableDate.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: availableDate
        })
    },
    async update(req, res) {
        try {
            await AvailableDateController.tryUpdate(req, res)
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
        const recordNumber = await AvailableDate.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const availableDate = await AvailableDate.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: availableDate
        })
    },
    async destroy(req, res) {
        try {
            await AvailableDateController.tryDestroy(req, res)
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
        const availableDate = await AvailableDate.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: availableDate
        })
    }
}

export default AvailableDateController
