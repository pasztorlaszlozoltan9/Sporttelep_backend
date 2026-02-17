import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const AvailableDate = sequelize.define('availableDates', {
    date: {
      type: DataTypes.DATEONLY
    },
    startTime: {
      type: DataTypes.TIME
    },
    fieldId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'fields',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
})

export default AvailableDate
