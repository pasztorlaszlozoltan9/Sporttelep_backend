import dotenvFlow from 'dotenv-flow'
import { Readable } from 'stream'

dotenvFlow.config()

const getCloudinaryClient = async () => {
    let cloudinary

    try {
        ({ v2: cloudinary } = await import('cloudinary'))
    }catch(error) {
        throw new Error('Cloudinary SDK is not installed. Run npm install cloudinary before using image uploads.')
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    })

    return cloudinary
}

const ensureCloudinaryConfig = () => {
    const requiredKeys = [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ]

    const missingKeys = requiredKeys.filter((key) => !process.env[key])
    if(missingKeys.length > 0) {
        throw new Error(`Missing Cloudinary configuration: ${missingKeys.join(', ')}`)
    }
}

const normalizeFolderName = (folderName = 'sporttelep') => {
    const normalizedFolderName = String(folderName || 'sporttelep').trim().replace(/^\/+|\/+$/g, '')
    if(!normalizedFolderName) {
        return 'sporttelep'
    }

    if(!/^[a-zA-Z0-9/_-]+$/.test(normalizedFolderName)) {
        throw new Error('Invalid Cloudinary folder name')
    }

    return normalizedFolderName
}

const uploadImageBuffer = async (file, options = {}) => {
    if(!file?.buffer) {
        throw new Error('No image buffer provided for upload')
    }

    ensureCloudinaryConfig()
    const cloudinary = await getCloudinaryClient()
    const folder = normalizeFolderName(options.folder)

    return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: 'image',
            use_filename: true,
            unique_filename: true,
            overwrite: false
        }, (error, result) => {
            if(error) {
                return reject(error)
            }

            resolve(result)
        })

        Readable.from(file.buffer).pipe(uploadStream)
    })
}

const listImages = async (options = {}) => {
    ensureCloudinaryConfig()
    const cloudinary = await getCloudinaryClient()

    const folder = normalizeFolderName(options.folder || 'sporttelep')
    const maxResults = Number.isInteger(options.maxResults) ? options.maxResults : 500

    const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix: `${folder}/`,
        max_results: Math.min(Math.max(maxResults, 1), 500)
    })

    return (result.resources || []).map((resource) => ({
        url: resource.secure_url,
        publicId: resource.public_id,
        createdAt: resource.created_at
    }))
}

export { listImages }
export default uploadImageBuffer