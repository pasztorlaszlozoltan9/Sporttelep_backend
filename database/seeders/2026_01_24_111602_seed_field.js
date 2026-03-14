 import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Field) {
    await db.Field.bulkCreate([
    {id:1, name: "Field 1", locationId: 1, sportId: 1},
    {id:2, name: "Field 2", locationId: 1, sportId: 2},
    {id:3, name: "Field 3", locationId: 2, sportId: 1},
    {id:4, name: "Field 4", locationId: 2, sportId: 3},
    {id:5, name: "Field 5", locationId: 3, sportId: 2},
    {id:6, name: "Field 5", locationId: 3, sportId: 3},
    {id:7, name: "Field 5", locationId: 3, sportId: 4}

      
    ]);
  }else {
    await QueryInterface.bulkInsert('fields', [

    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('fields');
}

export { up, down }
