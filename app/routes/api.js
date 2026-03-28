import Router from 'express'
const router = Router()

import AuthController from '../controllers/authController.js';
import UserController from '../controllers/userController.js';
import verifyToken from '../middleware/authjwt.js';
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
router.get('/users', [verifyToken], UserController.index)
router.get('/users/:id', [verifyToken], UserController.show)
router.put('/users/:id', [verifyToken], UserController.update)
router.put('/users/:id/password', [verifyToken], UserController.updatePassword)
router.delete('/users/:id', [verifyToken], UserController.destroy)

router.get('/locations', LocationController.index);
router.get('/locations/:id', LocationController.show);
router.post('/locations', LocationController.store);
router.put('/locations/:id', LocationController.update);
router.delete('/locations/:id', LocationController.destroy);

router.get('/sports', SportController.index);
router.get('/sports/:id', SportController.show);
router.post('/sports', SportController.store);
router.put('/sports/:id', SportController.update);
router.delete('/sports/:id', SportController.destroy);

router.get('/fields', FieldController.index);
router.get('/fields/:id', FieldController.show);
router.post('/fields', FieldController.store);
router.put('/fields/:id', FieldController.update);
router.delete('/fields/:id', FieldController.destroy);

router.get('/bookings', BookingController.index);
router.get('/bookings/:id', BookingController.show);
router.post('/bookings', BookingController.store);
router.put('/bookings/:id', BookingController.update);
router.delete('/bookings/:id', BookingController.destroy);

router.get('/teszts', TesztController.index);
router.get('/teszts/:id', TesztController.show);
router.post('/teszts', TesztController.store);
router.put('/teszts/:id', TesztController.update);
router.delete('/teszts/:id', TesztController.destroy);

router.get('/bookings', BookingController.index);
router.get('/bookings/:id', BookingController.show);
router.post('/bookings', BookingController.store);
router.put('/bookings/:id', BookingController.update);
router.delete('/bookings/:id', BookingController.destroy);

router.get('/prices', PricesController.index);
router.get('/prices/:id', PricesController.show);
router.post('/prices', PricesController.store);
router.put('/prices/:id', PricesController.update);
router.delete('/prices/:id', PricesController.destroy);

router.get('/field-booking-windows', FieldBookingWindowController.index);
router.get('/field-booking-windows/:id', FieldBookingWindowController.show);
router.post('/field-booking-windows', FieldBookingWindowController.store);
router.put('/field-booking-windows/:id', FieldBookingWindowController.update);
router.delete('/field-booking-windows/:id', FieldBookingWindowController.destroy);

export default router
