import { DataTypes } from 'sequelize';

async function up({ context: QueryInterface }) {
  const tableDefinition = await QueryInterface.describeTable('sports');

  if (tableDefinition.duration) {
    await QueryInterface.removeColumn('sports', 'duration');
  }
}

async function down({ context: QueryInterface }) {
  const tableDefinition = await QueryInterface.describeTable('sports');

  if (!tableDefinition.duration) {
    await QueryInterface.addColumn('sports', 'duration', {
      type: DataTypes.INTEGER,
      allowNull: true
    });
  }
}

export { up, down };
