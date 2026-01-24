import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Location) {
    await db.Location.bulkCreate([
      
    ]);
  }else {
    await QueryInterface.bulkInsert('locations', [

    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('locations');
}

export { up, down }
