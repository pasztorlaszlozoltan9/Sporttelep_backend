import multer, { MulterError } from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]);

const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const isValidMimeType = allowedMimeTypes.has(file.mimetype);
        const isValidExtension = allowedExtensions.has(ext);

        if (!isValidMimeType || !isValidExtension) {
            return cb(new Error('Only .png, .jpg, .jpeg, .webp image files are allowed'));
        }

        cb(null, true);
    }
});

export const singleImageUpload = (fieldName = 'image') => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (error) => {
            if(!error) {
                return next()
            }

            let message = error.message
            if(error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
                message = 'Image size exceeds the 5MB limit'
            }

            return res.status(400).json({
                success: false,
                message
            })
        })
    }
}
