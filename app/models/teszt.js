import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Teszt = sequelize.define('teszts', {
    name: { type: DataTypes.STRING,  allowNull: false  }
}, {
    timestamps: true,
    freezeTableName: true
})

export default Teszt
