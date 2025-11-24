import User from './user.js';
import sequelize from '../database/database.js'

const db = {};

db.User = User;

await sequelize.sync({
    alter: true
})

export default db;
