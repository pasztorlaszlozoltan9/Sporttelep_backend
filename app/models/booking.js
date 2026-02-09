import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Booking = sequelize.define('bookings', {
    sportsId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'sports',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    locationsId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'locations',
            key: 'id'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    fieldsId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'fields',
            key: 'id'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    usersId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    availablaDatesId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'availableDates',
            key: 'id'  
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    pricesId:{
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
}, {
    timestamps: true,
    freezeTableName: true
})

export default Booking
