import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  const now = new Date();
  const seedRows = [
    { fieldId: 1, weekday: 1, openTime: '12:00:00', closeTime: '22:30:00', isActive: 1, createdAt: now, updatedAt: now },
    { fieldId: 1, weekday: 2, openTime: '12:00:00', closeTime: '22:30:00', isActive: 1, createdAt: now, updatedAt: now },
    { fieldId: 1, weekday: 3, openTime: '12:00:00', closeTime: '22:30:00', isActive: 1, createdAt: now, updatedAt: now },
    { fieldId: 1, weekday: 4, openTime: '12:00:00', closeTime: '22:30:00', isActive: 1, createdAt: now, updatedAt: now },
    { fieldId: 1, weekday: 5, openTime: '12:00:00', closeTime: '22:30:00', isActive: 1, createdAt: now, updatedAt: now },
    { fieldId: 1, weekday: 6, openTime: '10:00:00', closeTime: '21:00:00', isActive: 1, createdAt: now, updatedAt: now },
    { fieldId: 1, weekday: 0, openTime: '10:00:00', closeTime: '21:00:00', isActive: 1, createdAt: now, updatedAt: now }
  ];

  if(db.FieldBookingWindow) {
    await db.FieldBookingWindow.bulkCreate(seedRows);
  } else {
    await QueryInterface.bulkInsert('fieldBookingWindows', seedRows);
  }
}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('fieldBookingWindows', {
    fieldId: 1
  });
}

export { up, down }
