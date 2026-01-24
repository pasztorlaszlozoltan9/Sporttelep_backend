import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Prices) {
    await db.Prices.bulkCreate([
      
    ]);
  }else {
    await QueryInterface.bulkInsert('prices', [

    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('prices');
}

export { up, down }
