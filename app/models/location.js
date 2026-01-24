import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Location = sequelize.define('locations', {
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    
}, {
    timestamps: true,
    freezeTableName: true
})

export default Location
