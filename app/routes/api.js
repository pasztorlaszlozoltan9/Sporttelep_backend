import Router from 'express'
const router = Router()

import AuthController from '../controllers/authController.js';
import UserController from '../controllers/userController.js';
import verifyToken from '../middleware/authjwt.js';
import LocationController from '../controllers/locationController.js';
 
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/users', [verifyToken], UserController.index)
router.get('/users/:id', [verifyToken], UserController.show)
router.put('/users/:id/password', [verifyToken], UserController.updatePassword)

router.get('/locations', LocationController.index)
router.get('/locations/:id', LocationController.show)
router.post('/locations', LocationController.store)
router.put('/locations/:id', LocationController.update)
router.delete('/locations/:id', LocationController.destroy)



export default router
