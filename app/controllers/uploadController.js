import uploadImageBuffer, { listImages } from '../services/cloudinaryService.js'

const UploadController = {
    async image(req, res) {
        try {
            await UploadController.tryImage(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Image upload failed!',
                error: error.message
            })
        }
    },
    async tryImage(req, res) {
        if(!req.file) {
            res.status(400)
            return res.json({
                success: false,
                message: 'Image file is required'
            })
        }

        const result = await uploadImageBuffer(req.file, {
            folder: req.body.folder || 'sporttelep'
        })

        res.status(201)
        res.json({
            success: true,
            data: {
                imageUrl: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height
            }
        })
    },
    async images(req, res) {
        try {
            await UploadController.tryImages(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Image listing failed!',
                error: error.message
            })
        }
    },
    async tryImages(req, res) {
        const folder = req.query.folder || 'sporttelep'
        const images = await listImages({ folder })

        res.status(200)
        res.json({
            success: true,
            data: images.map((item) => item.url)
        })
    }
}

export default UploadController