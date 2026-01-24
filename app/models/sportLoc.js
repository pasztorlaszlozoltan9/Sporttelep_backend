import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'
import { identityOrigin } from 'firebase-tools/lib/api.js'

const SportLoc = sequelize.define('sportLocs', {
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
    }
}, {
    timestamps: true,
    freezeTableName: true
})

export default SportLoc
