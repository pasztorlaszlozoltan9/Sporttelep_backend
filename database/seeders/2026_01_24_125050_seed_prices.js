import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Prices) {
    await db.Prices.bulkCreate([
      { fieldId: 1, price: 5000 },
      { fieldId: 2, price: 6000 },
      { fieldId: 3, price: 5000 },
      { fieldId: 4, price: 4000 },
      { fieldId: 5, price: 4500 }
      
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
