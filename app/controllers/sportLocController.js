import SportLoc from '../models/sportLoc.js'

const SportLocController = {
    async index(req, res) {
        try {
            await SportLocController.tryIndex(req, res)
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
        const sportLocs = await SportLoc.findAll()
        res.status(200)
        res.json({
            success: true,
            data: sportLocs
        })
    },
    async show(req, res) {
        try {
            await SportLocController.tryShow(req, res)
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
        const sportLoc = await SportLoc.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: sportLoc
        })
    },
    async store(req, res) {
        try {
            await SportLocController.tryStore(req, res)
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
        const sportLoc = await SportLoc.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: sportLoc
        })
    },
    async update(req, res) {
        try {
            await SportLocController.tryUpdate(req, res)
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
        const recordNumber = await SportLoc.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const sportLoc = await SportLoc.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: sportLoc
        })
    },
    async destroy(req, res) {
        try {
            await SportLocController.tryDestroy(req, res)
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
        const sportLoc = await SportLoc.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: sportLoc
        })
    }
}

export default SportLocController
