import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.AvailableDate) {
    await db.AvailableDate.bulkCreate([
      
    ]);
  }else {
    await QueryInterface.bulkInsert('availableDates', [

    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('availableDates');
}

export { up, down }
