import Location from '../models/location.js'

const LocationController = {
    async index(req, res) {
        try {
            await LocationController.tryIndex(req, res)
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
        const locations = await Location.findAll()
        res.status(200)
        res.json({
            success: true,
            data: locations
        })
    },
    async show(req, res) {
        try {
            await LocationController.tryShow(req, res)
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
        const location = await Location.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: location
        })
    },
    async store(req, res) {
        try {
            await LocationController.tryStore(req, res)
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
        const location = await Location.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: location
        })
    },
    async update(req, res) {
        try {
            await LocationController.tryUpdate(req, res)
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
        const recordNumber = await Location.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const location = await Location.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: location
        })
    },
    async destroy(req, res) {
        try {
            await LocationController.tryDestroy(req, res)
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
        const location = await Location.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: location
        })
    }
}

export default LocationController