import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Location = sequelize.define('location', {
    name: { type: DataTypes.STRING,  allowNull: false  },
    address: { type: DataTypes.STRING,  allowNull: true  },
    email: { type: DataTypes.STRING,  allowNull: true  }
})

export default Location
