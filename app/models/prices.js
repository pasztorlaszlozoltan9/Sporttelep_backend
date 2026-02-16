import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'
import Field from './field.js'


const Prices = sequelize.define('prices', {
    price: { type: DataTypes.INTEGER,  allowNull: false  },
    fieldsId: {
      type: DataTypes.INTEGER,
      references: {
          model: 'fields',
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
}, {
    timestamps: true,
    freezeTableName: true
})

export default Prices
