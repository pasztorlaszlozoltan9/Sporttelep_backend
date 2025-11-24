import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Thing) {
    await db.Thing.bulkCreate([
      
    ]);
  }else {
    await QueryInterface.bulkInsert('things', [

    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('things');
}

export { up, down }
