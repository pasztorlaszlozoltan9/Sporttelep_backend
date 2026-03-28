import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Sport = sequelize.define('sports', {
    name: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    }
}, {
    timestamps: true,
    freezeTableName: true
})

export default Sport
