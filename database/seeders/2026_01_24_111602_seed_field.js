import db from '../../app/models/modrels.js';

const seedRows = [
    { id: 1, name: 'BME-F1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 1, sportId: 1, createdAt: '2026-03-07 09:56:55.729 +00:00', updatedAt: '2026-03-12 08:39:15' },
    { id: 2, name: 'BME-K1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774731973/kos%C3%A1rlabda_grme2q.jpg', locationId: 1, sportId: 2, createdAt: '2026-03-07 09:56:55.729 +00:00', updatedAt: '2026-03-12 08:39:29' },
    { id: 3, name: 'PJS-F1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 2, sportId: 1, createdAt: '2026-03-07 09:56:55.729 +00:00', updatedAt: '2026-03-08 18:20:07.556 +00:00' },
    { id: 4, name: 'PJS-T1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', locationId: 2, sportId: 3, createdAt: '2026-03-07 09:56:55.729 +00:00', updatedAt: '2026-03-08 18:20:18.674 +00:00' },
    { id: 5, name: 'LIG-K1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774731973/kos%C3%A1rlabda_grme2q.jpg', locationId: 3, sportId: 2, createdAt: '2026-03-07 09:56:55.729 +00:00', updatedAt: '2026-03-08 18:20:31.003 +00:00' },
    { id: 6, name: 'LIG-T1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', locationId: 3, sportId: 3, createdAt: '2026-03-07 09:56:55.729 +00:00', updatedAt: '2026-03-08 18:20:38.899 +00:00' },
    { id: 8, name: 'BME-F2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 1, sportId: 1, createdAt: '2026-03-08 18:20:52.276 +00:00', updatedAt: '2026-03-08 18:20:52.276 +00:00' },
    { id: 9, name: 'BME-F3', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 1, sportId: 1, createdAt: '2026-03-08 18:21:06.906 +00:00', updatedAt: '2026-03-08 18:21:06.906 +00:00' },
    { id: 10, name: 'BME-K2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774731973/kos%C3%A1rlabda_grme2q.jpg', locationId: 1, sportId: 2, createdAt: '2026-03-08 18:21:20.245 +00:00', updatedAt: '2026-03-08 18:21:20.245 +00:00' },
    { id: 11, name: 'BME-T1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', locationId: 1, sportId: 3, createdAt: '2026-03-08 18:21:32.166 +00:00', updatedAt: '2026-03-08 18:21:32.166 +00:00' },
    { id: 12, name: 'BME-T2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', locationId: 1, sportId: 3, createdAt: '2026-03-08 18:21:41.031 +00:00', updatedAt: '2026-03-08 18:21:41.031 +00:00' },
    { id: 13, name: 'BME-R1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735390/sporttelep/file_ce17tr.jpg', locationId: 1, sportId: 6, createdAt: '2026-03-08 18:22:19.576 +00:00', updatedAt: '2026-03-08 18:22:19.576 +00:00' },
    { id: 14, name: 'BME-R2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735390/sporttelep/file_ce17tr.jpg', locationId: 1, sportId: 6, createdAt: '2026-03-08 18:22:29.865 +00:00', updatedAt: '2026-03-08 18:22:29.865 +00:00' },
    { id: 15, name: 'BME-P1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735401/sporttelep/file_pupi9b.jpg', locationId: 1, sportId: 7, createdAt: '2026-03-08 18:22:39.311 +00:00', updatedAt: '2026-03-08 18:22:39.311 +00:00' },
    { id: 16, name: 'BME-P2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735401/sporttelep/file_pupi9b.jpg', locationId: 1, sportId: 7, createdAt: '2026-03-08 18:22:48.643 +00:00', updatedAt: '2026-03-08 18:22:48.643 +00:00' },
    { id: 17, name: 'PJS-F2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 2, sportId: 1, createdAt: '2026-03-08 18:23:13.592 +00:00', updatedAt: '2026-03-08 18:23:13.592 +00:00' },
    { id: 18, name: 'PJS-T2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', locationId: 2, sportId: 3, createdAt: '2026-03-08 18:23:26.450 +00:00', updatedAt: '2026-03-08 18:23:26.450 +00:00' },
    { id: 19, name: 'PJS-R1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735390/sporttelep/file_ce17tr.jpg', locationId: 2, sportId: 6, createdAt: '2026-03-08 18:23:44.446 +00:00', updatedAt: '2026-03-08 18:23:44.446 +00:00' },
    { id: 21, name: 'LIG-F1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 3, sportId: 1, createdAt: '2026-03-08 18:24:35.070 +00:00', updatedAt: '2026-03-08 18:24:35.070 +00:00' },
    { id: 22, name: 'UJP-F1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 4, sportId: 1, createdAt: '2026-03-08 18:24:58.742 +00:00', updatedAt: '2026-03-08 18:24:58.742 +00:00' },
    { id: 23, name: 'UJP-F2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 4, sportId: 1, createdAt: '2026-03-08 18:25:07.277 +00:00', updatedAt: '2026-03-08 18:25:07.277 +00:00' },
    { id: 24, name: 'UJP-F3', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 4, sportId: 1, createdAt: '2026-03-08 18:25:16.903 +00:00', updatedAt: '2026-03-08 18:25:16.903 +00:00' },
    { id: 25, name: 'UJP-P1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735401/sporttelep/file_pupi9b.jpg', locationId: 4, sportId: 7, createdAt: '2026-03-08 18:25:29.721 +00:00', updatedAt: '2026-03-08 18:25:29.721 +00:00' },
    { id: 26, name: 'UJP-K1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774731973/kos%C3%A1rlabda_grme2q.jpg', locationId: 4, sportId: 2, createdAt: '2026-03-08 18:25:42.481 +00:00', updatedAt: '2026-03-08 18:25:42.481 +00:00' },
    { id: 27, name: 'UJP-K2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774731973/kos%C3%A1rlabda_grme2q.jpg', locationId: 4, sportId: 2, createdAt: '2026-03-08 18:25:51.710 +00:00', updatedAt: '2026-03-08 18:25:51.710 +00:00' },
    { id: 28, name: 'UJB-F1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 5, sportId: 1, createdAt: '2026-03-08 18:26:06.719 +00:00', updatedAt: '2026-03-08 18:26:06.719 +00:00' },
    { id: 29, name: 'UJB-F2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 5, sportId: 1, createdAt: '2026-03-08 18:26:16.047 +00:00', updatedAt: '2026-03-08 18:26:16.047 +00:00' },
    { id: 30, name: 'UJB-T1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', locationId: 5, sportId: 3, createdAt: '2026-03-08 18:26:25.289 +00:00', updatedAt: '2026-03-08 18:26:25.289 +00:00' },
    { id: 31, name: 'UJB-T2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', locationId: 5, sportId: 3, createdAt: '2026-03-08 18:26:33.794 +00:00', updatedAt: '2026-03-08 18:26:33.794 +00:00' },
    { id: 32, name: 'UJB-T3', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', locationId: 5, sportId: 3, createdAt: '2026-03-08 18:26:42.991 +00:00', updatedAt: '2026-03-08 18:26:42.991 +00:00' },
    { id: 33, name: 'UJB-P1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735401/sporttelep/file_pupi9b.jpg', locationId: 5, sportId: 7, createdAt: '2026-03-08 18:26:52.305 +00:00', updatedAt: '2026-03-08 18:26:52.305 +00:00' },
    { id: 35, name: 'PJS-F3', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', locationId: 2, sportId: 1, createdAt: '2026-03-12 11:25:42', updatedAt: '2026-03-12 11:25:42' },
    { id: 37, name: 'BME-PP1', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735418/sporttelep/file_tk0x1j.jpg', locationId: 1, sportId: 10, createdAt: '2026-03-14 09:03:37', updatedAt: '2026-03-14 09:03:37' },
    { id: 38, name: 'BME-PP2', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774884175/sporttelep/file_xaptuu.jpg', locationId: 1, sportId: 10, createdAt: '2026-03-30 15:23:03', updatedAt: '2026-03-30 15:23:03' }
];

async function up({context: QueryInterface}) {
  if(db.Field) {
    await db.Field.bulkCreate(seedRows);
  }else {
    await QueryInterface.bulkInsert('fields', seedRows);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('fields');
}

export { up, down }
