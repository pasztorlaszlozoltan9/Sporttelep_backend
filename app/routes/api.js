import Router from 'express'
const router = Router()

import AuthController from '../controllers/authController.js';
import UserController from '../controllers/userController.js';
import verifyToken from '../middleware/authjwt.js';
import LocationController from '../controllers/locationController.js';
import SportController from '../controllers/sportController.js';
import FieldController from '../controllers/fieldController.js';
import AvailableDateController from '../controllers/availableDateController.js';
import BookingController from '../controllers/bookingController.js';
import SportLocController from '../controllers/sportLocController.js';
import TesztController from '../controllers/tesztController.js';
import PricesController from '../controllers/pricesController.js';
 
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/users', [verifyToken], UserController.index)
router.get('/users/:id', [verifyToken], UserController.show)
router.put('/users/:id/password', [verifyToken], UserController.updatePassword)

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

router.get('/availabledates', AvailableDateController.index);
router.get('/availabledates/:id', AvailableDateController.show);
router.post('/availabledates', AvailableDateController.store);
router.put('/availabledates/:id', AvailableDateController.update);
router.delete('/availabledates/:id', AvailableDateController.destroy);

router.get('/bookings', BookingController.index);
router.get('/bookings/:id', BookingController.show);
router.post('/bookings', BookingController.store);
router.put('/bookings/:id', BookingController.update);
router.delete('/bookings/:id', BookingController.destroy);

router.get('/sportlocs', SportLocController.index);
router.get('/sportlocs/:id', SportLocController.show);
router.post('/sportlocs', SportLocController.store);
router.put('/sportlocs/:id', SportLocController.update);
router.delete('/sportlocs/:id', SportLocController.destroy);

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

export default router
