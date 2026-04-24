import db from '../../app/models/modrels.js';

const seedRows = [
    { id: 1, price: 6000, fieldId: 1, createdAt: '2026-03-07 09:56:55.774 +00:00', updatedAt: '2026-03-07 10:11:59.914 +00:00' },
    { id: 8, price: 5000, fieldId: 3, createdAt: '2026-03-08 18:27:49.914 +00:00', updatedAt: '2026-03-31 11:35:15' },
    { id: 9, price: 9000, fieldId: 4, createdAt: '2026-03-08 18:27:59.509 +00:00', updatedAt: '2026-03-11 17:43:46.093 +00:00' },
    { id: 10, price: 6500, fieldId: 5, createdAt: '2026-03-08 18:28:11.517 +00:00', updatedAt: '2026-03-08 18:28:11.517 +00:00' },
    { id: 11, price: 7500, fieldId: 6, createdAt: '2026-03-08 18:28:29.487 +00:00', updatedAt: '2026-03-08 18:28:29.487 +00:00' },
    { id: 12, price: 8000, fieldId: 8, createdAt: '2026-03-08 18:28:45.587 +00:00', updatedAt: '2026-03-08 18:28:45.587 +00:00' },
    { id: 13, price: 9500, fieldId: 9, createdAt: '2026-03-08 18:28:55.073 +00:00', updatedAt: '2026-03-08 18:28:55.073 +00:00' },
    { id: 14, price: 5900, fieldId: 10, createdAt: '2026-03-08 18:29:08.207 +00:00', updatedAt: '2026-03-08 18:29:08.207 +00:00' },
    { id: 15, price: 7800, fieldId: 11, createdAt: '2026-03-08 18:29:20.416 +00:00', updatedAt: '2026-03-08 18:29:20.416 +00:00' },
    { id: 16, price: 7800, fieldId: 12, createdAt: '2026-03-08 18:29:29.480 +00:00', updatedAt: '2026-03-08 18:29:37.476 +00:00' },
    { id: 17, price: 5500, fieldId: 13, createdAt: '2026-03-08 18:29:49.628 +00:00', updatedAt: '2026-03-08 18:29:49.628 +00:00' },
    { id: 18, price: 5500, fieldId: 14, createdAt: '2026-03-08 18:30:02.409 +00:00', updatedAt: '2026-03-08 18:30:02.409 +00:00' },
    { id: 19, price: 8500, fieldId: 15, createdAt: '2026-03-08 18:30:13.530 +00:00', updatedAt: '2026-03-08 18:30:13.530 +00:00' },
    { id: 20, price: 8500, fieldId: 16, createdAt: '2026-03-08 18:30:21.648 +00:00', updatedAt: '2026-03-08 18:30:21.648 +00:00' },
    { id: 21, price: 7500, fieldId: 17, createdAt: '2026-03-08 18:30:37.172 +00:00', updatedAt: '2026-03-08 18:30:37.172 +00:00' },
    { id: 22, price: 9000, fieldId: 18, createdAt: '2026-03-08 18:30:55.710 +00:00', updatedAt: '2026-03-08 18:30:55.710 +00:00' },
    { id: 23, price: 7000, fieldId: 19, createdAt: '2026-03-08 18:31:07.214 +00:00', updatedAt: '2026-03-08 18:31:07.214 +00:00' },
    { id: 24, price: 7500, fieldId: 20, createdAt: '2026-03-08 18:31:18.523 +00:00', updatedAt: '2026-03-08 18:31:18.523 +00:00' },
    { id: 25, price: 11500, fieldId: 21, createdAt: '2026-03-08 18:31:35.207 +00:00', updatedAt: '2026-03-08 18:31:35.207 +00:00' },
    { id: 26, price: 12000, fieldId: 22, createdAt: '2026-03-08 18:31:57.364 +00:00', updatedAt: '2026-03-08 18:32:02.809 +00:00' },
    { id: 27, price: 12000, fieldId: 23, createdAt: '2026-03-08 18:32:15.854 +00:00', updatedAt: '2026-03-08 18:32:15.854 +00:00' },
    { id: 28, price: 10500, fieldId: 24, createdAt: '2026-03-08 18:32:27.531 +00:00', updatedAt: '2026-03-08 18:32:27.531 +00:00' },
    { id: 29, price: 7600, fieldId: 25, createdAt: '2026-03-08 18:32:44.513 +00:00', updatedAt: '2026-03-08 18:32:44.513 +00:00' },
    { id: 30, price: 6200, fieldId: 26, createdAt: '2026-03-08 18:32:56.381 +00:00', updatedAt: '2026-03-08 18:32:56.381 +00:00' },
    { id: 31, price: 6200, fieldId: 27, createdAt: '2026-03-08 18:33:14.020 +00:00', updatedAt: '2026-03-08 18:33:14.020 +00:00' },
    { id: 32, price: 8500, fieldId: 28, createdAt: '2026-03-08 18:33:24.552 +00:00', updatedAt: '2026-03-08 18:33:24.552 +00:00' },
    { id: 33, price: 8500, fieldId: 29, createdAt: '2026-03-08 18:33:33.448 +00:00', updatedAt: '2026-03-08 18:33:33.448 +00:00' },
    { id: 34, price: 10900, fieldId: 30, createdAt: '2026-03-08 18:33:53.210 +00:00', updatedAt: '2026-03-08 18:33:53.210 +00:00' },
    { id: 35, price: 10900, fieldId: 31, createdAt: '2026-03-08 18:34:01.168 +00:00', updatedAt: '2026-03-08 18:34:01.168 +00:00' },
    { id: 36, price: 9900, fieldId: 32, createdAt: '2026-03-08 18:34:09.512 +00:00', updatedAt: '2026-03-08 18:34:09.512 +00:00' },
    { id: 37, price: 11000, fieldId: 33, createdAt: '2026-03-08 18:34:36.204 +00:00', updatedAt: '2026-03-08 18:34:36.204 +00:00' },
    { id: 38, price: 8500, fieldId: 2, createdAt: '2026-03-11 17:12:31.638 +00:00', updatedAt: '2026-03-11 17:12:31.638 +00:00' },
    { id: 40, price: 6500, fieldId: 37, createdAt: '2026-03-28 22:46:30', updatedAt: '2026-03-28 22:46:30' }
];

async function up({context: QueryInterface}) {
  if(db.Prices) {
    await db.Prices.bulkCreate(seedRows);
  }else {
    await QueryInterface.bulkInsert('prices', seedRows);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('prices');
}

export { up, down }
