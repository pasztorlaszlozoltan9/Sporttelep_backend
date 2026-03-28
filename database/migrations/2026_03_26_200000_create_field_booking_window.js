import { DataTypes } from 'sequelize';

async function up({context: QueryInterface}) {
  // Check if table already exists
  const tableExists = await QueryInterface.tableExists('fieldBookingWindows');
  
  if (!tableExists) {
    await QueryInterface.createTable('fieldBookingWindows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE }
    });
  }
}

async function down({context: QueryInterface}) {
  const tableExists = await QueryInterface.tableExists('fieldBookingWindows');
  
  if (tableExists) {
    await QueryInterface.dropTable('fieldBookingWindows');
  }
}

export { up, down }
