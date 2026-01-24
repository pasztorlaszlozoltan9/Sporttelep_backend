import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.SportLoc) {
    await db.SportLoc.bulkCreate([
      
    ]);
  }else {
    await QueryInterface.bulkInsert('sportLocs', [

    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('sportLocs');
}

export { up, down }
