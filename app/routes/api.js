import Router from 'express'
const router = Router()

import AuthController from '../controllers/authController.js';
import UploadController from '../controllers/uploadController.js';
import UserController from '../controllers/userController.js';
import verifyToken from '../middleware/authjwt.js';
import isAdmin from '../middleware/authAdmin.js';
import { singleImageUpload } from '../middleware/upload.js';
import LocationController from '../controllers/locationController.js';
import SportController from '../controllers/sportController.js';
import FieldController from '../controllers/fieldController.js';
import BookingController from '../controllers/bookingController.js';
import TesztController from '../controllers/tesztController.js';
import PricesController from '../controllers/pricesController.js';
import FieldBookingWindowController from '../controllers/fieldBookingWindowController.js';
 
router.post('/register', AuthController.register)
router.get('/verify-email/:token', AuthController.verifyEmail)
router.post('/forgot-password', AuthController.forgotPassword)
router.post('/reset-password/:token', AuthController.resetPassword)
router.post('/login', AuthController.login)
router.post('/google-signin', AuthController.googleSignIn)
router.post('/uploads/image', [verifyToken], isAdmin, singleImageUpload('image'), UploadController.image)
router.get('/uploads/images', [verifyToken], isAdmin, UploadController.images)
router.get('/users', [verifyToken], UserController.index)
router.get('/users/:id', [verifyToken], UserController.show)
router.put('/users/:id', [verifyToken], UserController.update)
router.put('/users/:id/password', [verifyToken], UserController.updatePassword)
router.delete('/users/:id', [verifyToken], UserController.destroy)

router.get('/locations', LocationController.index);
router.get('/locations/:id', LocationController.show);
router.post('/locations', [verifyToken], isAdmin, LocationController.store);
router.put('/locations/:id', [verifyToken], isAdmin, LocationController.update);
router.delete('/locations/:id', [verifyToken], isAdmin, LocationController.destroy);

router.get('/sports', SportController.index);
router.get('/sports/:id', SportController.show);
router.post('/sports', [verifyToken], isAdmin, SportController.store);
router.put('/sports/:id', [verifyToken], isAdmin, SportController.update);
router.delete('/sports/:id', [verifyToken], isAdmin, SportController.destroy);

router.get('/fields', FieldController.index);
router.get('/fields/:id', FieldController.show);
router.post('/fields', [verifyToken], isAdmin, FieldController.store);
router.put('/fields/:id', [verifyToken], isAdmin, FieldController.update);
router.delete('/fields/:id', [verifyToken], isAdmin, FieldController.destroy);

router.get('/bookings', BookingController.index);
router.get('/bookings/:id', BookingController.show);
router.post('/bookings', [verifyToken], BookingController.store);
router.put('/bookings/:id', [verifyToken], BookingController.update);
router.delete('/bookings/:id', [verifyToken], BookingController.destroy);

router.get('/teszts', TesztController.index);
router.get('/teszts/:id', TesztController.show);
router.post('/teszts', [verifyToken], isAdmin, TesztController.store);
router.put('/teszts/:id', [verifyToken], isAdmin, TesztController.update);
router.delete('/teszts/:id', [verifyToken], isAdmin, TesztController.destroy);

router.get('/prices', PricesController.index);
router.get('/prices/:id', PricesController.show);
router.post('/prices', [verifyToken], isAdmin, PricesController.store);
router.put('/prices/:id', [verifyToken], isAdmin, PricesController.update);
router.delete('/prices/:id', [verifyToken], isAdmin, PricesController.destroy);

router.get('/field-booking-windows', FieldBookingWindowController.index);
router.get('/field-booking-windows/:id', FieldBookingWindowController.show);
router.post('/field-booking-windows', [verifyToken], isAdmin, FieldBookingWindowController.store);
router.put('/field-booking-windows/:id', [verifyToken], isAdmin, FieldBookingWindowController.update);
router.delete('/field-booking-windows/:id', [verifyToken], isAdmin, FieldBookingWindowController.destroy);

export default router
