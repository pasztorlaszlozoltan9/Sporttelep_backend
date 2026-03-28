import { DataTypes } from 'sequelize';

async function up({context: QueryInterface}) {
  // Check if columns already exist before adding them
  const table = await QueryInterface.describeTable('bookings');
  
  if (!table.endTime) {
    await QueryInterface.addColumn('bookings', 'endTime', {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '00:00:00'
    });
  }

  if (!table.totalPrice) {
    await QueryInterface.addColumn('bookings', 'totalPrice', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
  }
}

async function down({context: QueryInterface}) {
  const table = await QueryInterface.describeTable('bookings');
  
  if (table.totalPrice) {
    await QueryInterface.removeColumn('bookings', 'totalPrice');
  }
  
  if (table.endTime) {
    await QueryInterface.removeColumn('bookings', 'endTime');
  }
}

export { up, down }
