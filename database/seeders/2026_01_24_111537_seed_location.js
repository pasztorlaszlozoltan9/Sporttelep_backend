import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Location) {
    await db.Location.bulkCreate([
      { name: "BME", address: "Bogdánfy utca ", email: "bme@gmail.com" },
      { name: "Pokorny József Sport- és Szabadidőközpont", address: "Szabadság utca 51-57 ", email: "bme@gmail.com" },
      { name: "Liget Budapest", address: "Városliget ", email: "office@ligetbudapest.hu" }
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
