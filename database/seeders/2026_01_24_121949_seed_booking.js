import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Booking) {
    await db.Booking.bulkCreate([
      
    ]);
  }else {
    await QueryInterface.bulkInsert('bookings', [

    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('bookings');
}

export { up, down }
