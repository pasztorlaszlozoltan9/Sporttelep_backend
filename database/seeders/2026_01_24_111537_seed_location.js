import db from '../../app/models/modrels.js';

const seedRows = [
    { id: 1, name: 'BME Sporttelep', address: '1117 Budapest, Bogdánfy utca 12', email: 'g-y38@hotmail.com', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735445/sporttelep/file_rvw0zr.jpg', createdAt: '2026-03-07 09:56:55.680 +00:00', updatedAt: '2026-04-21 15:55:50' },
    { id: 2, name: 'Pokorny József Sport- és Szabadidőközpont', address: '1028 Budapest, Szabadság utca 51', email: 'gyongyi.szucs01@gmail.com', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735478/sporttelep/file_wxfdcs.jpg', createdAt: '2026-03-07 09:56:55.680 +00:00', updatedAt: '2026-04-21 16:52:05' },
    { id: 3, name: 'Városligeti Sportcentrum', address: '1144 Budapest, Városliget', email: 'pasztito@gmail.com', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735488/sporttelep/file_sdcgov.jpg', createdAt: '2026-03-07 09:56:55.680 +00:00', updatedAt: '2026-04-21 15:56:15' },
    { id: 4, name: 'Újpalotai Úti Sporttelep', address: '1138 Budapest, Újpalotai Út 13.', email: 'pasztor.laci@prohuman.hu', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735499/sporttelep/file_kcsadg.jpg', createdAt: '2026-03-08 18:18:31.475 +00:00', updatedAt: '2026-04-21 15:56:23' },
    { id: 5, name: 'Újbudai Sportcentrum', address: '1115 Budapest, Bártfa u. 52/B', email: 'sport@sportujbuda.hu', imageUrl: 'https://res.cloudinary.com/di1fs4xko/image/upload/v1774735508/sporttelep/file_chy0z2.jpg', createdAt: '2026-03-08 18:19:27.723 +00:00', updatedAt: '2026-03-28 22:05:11' }
];

async function up({context: QueryInterface}) {
  if(db.Location) {
    await db.Location.bulkCreate(seedRows);
  }else {
    await QueryInterface.bulkInsert('locations', seedRows);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('locations');
}

export { up, down }
