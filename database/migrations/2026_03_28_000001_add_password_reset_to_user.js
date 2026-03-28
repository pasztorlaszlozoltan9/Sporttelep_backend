import { DataTypes } from 'sequelize';

async function up({ context: QueryInterface }) {
    const table = await QueryInterface.describeTable('users');

    if (!table.passwordResetToken) {
        await QueryInterface.addColumn('users', 'passwordResetToken', {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        });
    }

    if (!table.passwordResetExpires) {
        await QueryInterface.addColumn('users', 'passwordResetExpires', {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        });
    }
}

async function down({ context: QueryInterface }) {
    const table = await QueryInterface.describeTable('users');

    if (table.passwordResetExpires) {
        await QueryInterface.removeColumn('users', 'passwordResetExpires');
    }

    if (table.passwordResetToken) {
        await QueryInterface.removeColumn('users', 'passwordResetToken');
    }
}

export { up, down }
