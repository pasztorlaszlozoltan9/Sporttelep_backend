import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Sport) {
    await db.Sport.bulkCreate([
      { name: "Football" },
      { name: "Basketball" },
      { name: "Tennis" } ,
      { name:"Padel"} ,
      { name:"Volleyball"}

      
    ]);
  }else {
    await QueryInterface.bulkInsert('sports', [

    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('sports');
}

export { up, down }
