import Sport from '../models/sport.js'

const SportController = {
    async index(req, res) {
        try {
            await SportController.tryIndex(req, res)
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
        const sports = await Sport.findAll()
        res.status(200)
        res.json({
            success: true,
            data: sports
        })
    },
    async show(req, res) {
        try {
            await SportController.tryShow(req, res)
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
        const sport = await Sport.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: sport
        })
    },
    async store(req, res) {
        try {
            await SportController.tryStore(req, res)
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
        const sport = await Sport.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: sport
        })
    },
    async update(req, res) {
        try {
            await SportController.tryUpdate(req, res)
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
        const recordNumber = await Sport.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const sport = await Sport.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: sport
        })
    },
    async destroy(req, res) {
        try {
            await SportController.tryDestroy(req, res)
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
        const sport = await Sport.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: sport
        })
    }
}

export default SportController
