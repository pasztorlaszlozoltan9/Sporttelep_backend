import { DataTypes } from 'sequelize';

const columns = [
  { tableName: 'sports', columnName: 'imageUrl' },
  { tableName: 'locations', columnName: 'imageUrl' },
  { tableName: 'fields', columnName: 'imageUrl' }
]

async function up({context: QueryInterface}) {
  for (const column of columns) {
    const table = await QueryInterface.describeTable(column.tableName)
    if (!table[column.columnName]) {
      await QueryInterface.addColumn(column.tableName, column.columnName, {
        type: DataTypes.TEXT,
        allowNull: true
      })
    }
  }
}

async function down({context: QueryInterface}) {
  for (const column of columns) {
    const table = await QueryInterface.describeTable(column.tableName)
    if (table[column.columnName]) {
      await QueryInterface.removeColumn(column.tableName, column.columnName)
    }
  }
}

export { up, down }