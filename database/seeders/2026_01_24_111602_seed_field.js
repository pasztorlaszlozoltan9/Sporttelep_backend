import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Field) {
    await db.Field.bulkCreate([
      
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
