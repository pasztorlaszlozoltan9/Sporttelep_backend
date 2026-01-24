import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Sport = sequelize.define('sports', {
    name: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER
    }
}, {
    timestamps: true,
    freezeTableName: true
})

export default Sport
