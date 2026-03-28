import User from './user.js';
import sequelize from '../database/database.js'
import Location from './location.js';
import Sport from './sport.js';
import Field from './field.js';

import Booking from './booking.js';
import Teszt from './teszt.js';
import Prices from './prices.js';
import FieldBookingWindow from './fieldBookingWindow.js';

const db = {};

/* Import your models and write here. 
For example User: */
db.User = User;
db.Location = Location;
db.Sport = Sport;
db.Field = Field;

db.Booking = Booking;
db.Teszt = Teszt;
db.Booking = Booking;
db.Prices = Prices;
db.FieldBookingWindow = FieldBookingWindow;

// await sequelize.sync({ alter: true })

/*
Write the relationships between the models here.
*/

export default db;
