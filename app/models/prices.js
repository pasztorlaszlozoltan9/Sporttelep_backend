import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'


const Prices = sequelize.define('prices', {
    price: { type: DataTypes.INTEGER,  allowNull: false  },
    sportLocId: {
      type: DataTypes.INTEGER,
      references: {
          model: 'sportLocs',
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
