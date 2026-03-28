import { DataTypes } from 'sequelize';

async function up({context: QueryInterface}) {
  try {
    await QueryInterface.addColumn('users', 'verificationToken', 
      { type: DataTypes.STRING, 
        allowNull: true 
      });
  } catch (error) {
    if (error.message.includes('Duplicate column')) {
      console.log('verificationToken column already exists');
    } else {
      throw error;
    }
  }
  
  try {
    await QueryInterface.addColumn('users', 'verified', 
      { type: DataTypes.BOOLEAN, 
        defaultValue: false 
      });
  } catch (error) {
    if (error.message.includes('Duplicate column')) {
      console.log('verified column already exists');
    } else {
      throw error;
    }
  }
}

async function down({context: QueryInterface}) {
  await QueryInterface.removeColumn('users', 'verificationToken');
  await QueryInterface.removeColumn('users', 'verified');
}

export { up, down }
