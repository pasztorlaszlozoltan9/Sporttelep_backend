import { DataTypes, NUMBER } from 'sequelize';

async function up({context: QueryInterface}) {
  await QueryInterface.createTable('sports', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER
    },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }    
  });
}

async function down({context: QueryInterface}) {
  await QueryInterface.dropTable('sports');
}

export { up, down }
