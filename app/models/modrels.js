import User from './user.js';
import sequelize from '../database/database.js'
import Location from './location.js';
import Sport from './sport.js';
import Field from './field.js';
import AvailableDate from './availableDate.js';
import Booking from './booking.js';
import SportLoc from './sportLoc.js';
import Teszt from './teszt.js';
import Prices from './prices.js';

const db = {};

/* Import your models and write here. 
For example User: */
db.User = User;
db.Location = Location;
db.Sport = Sport;
db.Field = Field;
db.AvailableDate = AvailableDate;
db.Booking = Booking;
db.SportLoc = SportLoc;
db.Teszt = Teszt;
db.Booking = Booking;
db.Prices = Prices;

// await sequelize.sync({ alter: true })

/*
Write the relationships between the models here.
*/

export default db;
