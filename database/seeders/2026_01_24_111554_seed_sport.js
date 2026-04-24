import db from '../../app/models/modrels.js';

const seedRows = [
    { id: 1, name: 'Labdarúgás', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774734073/sporttelep/file_rljn4t.jpg', createdAt: '2026-03-07 09:56:55.708 +00:00', updatedAt: '2026-03-28 21:52:22' },
    { id: 2, name: 'Kosárlabda', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735379/sporttelep/file_sjbnpe.jpg', createdAt: '2026-03-07 09:56:55.708 +00:00', updatedAt: '2026-03-28 22:03:01' },
    { id: 3, name: 'Tenisz', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735344/sporttelep/file_vuso1h.jpg', createdAt: '2026-03-07 09:56:55.708 +00:00', updatedAt: '2026-03-28 22:02:28' },
    { id: 6, name: 'Röplabda', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735390/sporttelep/file_ce17tr.jpg', createdAt: '2026-03-08 18:14:54.830 +00:00', updatedAt: '2026-03-28 22:03:12' },
    { id: 7, name: 'Padel', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735401/sporttelep/file_pupi9b.jpg', createdAt: '2026-03-08 18:15:01.887 +00:00', updatedAt: '2026-03-28 22:03:23' },
    { id: 10, name: 'Ping-Pong', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1775494507/sporttelep/file_bl53k1.jpg', createdAt: '2026-03-14 09:02:50', updatedAt: '2026-04-06 16:55:12' }
];

async function up({context: QueryInterface}) {
  if(db.Sport) {
    await db.Sport.bulkCreate(seedRows);
  }else {
    await QueryInterface.bulkInsert('sports', seedRows);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('sports');
}

export { up, down }
