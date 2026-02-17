import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const User = sequelize.define('user', {
    email: { type: DataTypes.STRING,  allowNull: false, unique: true },
    password: { type: DataTypes.STRING , allowNull: false },
    phone: {type: DataTypes.NUMBER, allowNull: false,},
    fullname: {type: DataTypes.STRING, allowNull: false,},
    roleId: { type: DataTypes.INTEGER, defaultValue: 0 }
})

export default User
