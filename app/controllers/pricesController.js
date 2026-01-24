import Prices from '../models/prices.js'

const PricesController = {
    async index(req, res) {
        try {
            await PricesController.tryIndex(req, res)
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
        const prices = await Prices.findAll()
        res.status(200)
        res.json({
            success: true,
            data: prices
        })
    },
    async show(req, res) {
        try {
            await PricesController.tryShow(req, res)
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
        const prices = await Prices.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: prices
        })
    },
    async store(req, res) {
        try {
            await PricesController.tryStore(req, res)
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
        const prices = await Prices.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: prices
        })
    },
    async update(req, res) {
        try {
            await PricesController.tryUpdate(req, res)
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
        const recordNumber = await Prices.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const prices = await Prices.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: prices
        })
    },
    async destroy(req, res) {
        try {
            await PricesController.tryDestroy(req, res)
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
        const prices = await Prices.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: prices
        })
    }
}

export default PricesController
