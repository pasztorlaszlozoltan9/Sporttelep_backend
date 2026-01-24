import Field from '../models/field.js'

const FieldController = {
    async index(req, res) {
        try {
            await FieldController.tryIndex(req, res)
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
        const fields = await Field.findAll()
        res.status(200)
        res.json({
            success: true,
            data: fields
        })
    },
    async show(req, res) {
        try {
            await FieldController.tryShow(req, res)
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
        const field = await Field.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: field
        })
    },
    async store(req, res) {
        try {
            await FieldController.tryStore(req, res)
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
        const field = await Field.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: field
        })
    },
    async update(req, res) {
        try {
            await FieldController.tryUpdate(req, res)
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
        const recordNumber = await Field.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const field = await Field.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: field
        })
    },
    async destroy(req, res) {
        try {
            await FieldController.tryDestroy(req, res)
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
        const field = await Field.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: field
        })
    }
}

export default FieldController
