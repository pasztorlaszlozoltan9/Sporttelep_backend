import { DataTypes } from 'sequelize';

async function up({context: QueryInterface}) {
  await QueryInterface.addColumn('users', 'verificationToken', 
    { type: DataTypes.STRING, 
      allowNull: true 
    });
  await QueryInterface.addColumn('users', 'verified', 
    { type: DataTypes.BOOLEAN, 
      defaultValue: false 
    });
}

async function down({context: QueryInterface}) {
  await QueryInterface.removeColumn('users', 'verificationToken');
  await QueryInterface.removeColumn('users', 'verified');
}

export { up, down }
