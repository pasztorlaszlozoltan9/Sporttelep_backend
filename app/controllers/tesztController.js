import Teszt from '../models/teszt.js'

const TesztController = {
    async index(req, res) {
        try {
            await TesztController.tryIndex(req, res)
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
        const teszts = await Teszt.findAll()
        res.status(200)
        res.json({
            success: true,
            data: teszts
        })
    },
    async show(req, res) {
        try {
            await TesztController.tryShow(req, res)
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
        const teszt = await Teszt.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: teszt
        })
    },
    async store(req, res) {
        try {
            await TesztController.tryStore(req, res)
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
        const teszt = await Teszt.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: teszt
        })
    },
    async update(req, res) {
        try {
            await TesztController.tryUpdate(req, res)
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
        const recordNumber = await Teszt.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const teszt = await Teszt.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: teszt
        })
    },
    async destroy(req, res) {
        try {
            await TesztController.tryDestroy(req, res)
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
        const teszt = await Teszt.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: teszt
        })
    }
}

export default TesztController
