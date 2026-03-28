import { DataTypes } from 'sequelize';

async function up({ context: QueryInterface }) {
    const table = await QueryInterface.describeTable('users');

    if (!table.active) {
        await QueryInterface.addColumn('users', 'active', {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        });
    }
}

async function down({ context: QueryInterface }) {
    const table = await QueryInterface.describeTable('users');

    if (table.active) {
        await QueryInterface.removeColumn('users', 'active');
    }
}

export { up, down }
