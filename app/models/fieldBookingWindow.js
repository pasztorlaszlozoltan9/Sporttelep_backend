import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const FieldBookingWindow = sequelize.define('fieldBookingWindows', {
    fieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'fields',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    weekday: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    openTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    closeTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    isActive: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: true,
    freezeTableName: true
})

export default FieldBookingWindow
