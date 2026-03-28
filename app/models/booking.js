import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Booking = sequelize.define('bookings', {
    sportId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'sports',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    fieldId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'fields',
            key: 'id'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    userId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    priceId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'prices',
            key: 'id'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    date: { type: DataTypes.DATEONLY, allowNull: false  },
    startTime: { type: DataTypes.TIME, allowNull: false  },
    endTime: { type: DataTypes.TIME, allowNull: false },
    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
}, {
    timestamps: true,
    freezeTableName: true
})

export default Booking
