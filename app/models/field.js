import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Field = sequelize.define('fields', {
    name: {
      type: DataTypes.STRING
    },
    locationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'locations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    sportId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'sports',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }}, {
    timestamps: true,
    freezeTableName: true
})

export default Field
