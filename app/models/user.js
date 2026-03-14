import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const User = sequelize.define('user', {
    email: { type: DataTypes.STRING,  allowNull: false, unique: true },
    password: { type: DataTypes.STRING , allowNull: false },
    phone: {type: DataTypes.STRING, allowNull: false,},
    fullname: {type: DataTypes.STRING, allowNull: false,},
    roleId: { type: DataTypes.INTEGER, defaultValue: 0 },
    verificationToken: { type: DataTypes.STRING, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    //active: { type: DataTypes.BOOLEAN, defaultValue: true },
    
})

export default User
