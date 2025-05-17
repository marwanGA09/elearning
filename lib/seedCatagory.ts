const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

const main = async () => {
  console.log('start ...');
  await db.category.createMany({
    data: [
      {
        name: 'Math',
      },
      {
        name: 'Science',
      },
      {
        name: 'History',
      },
      {
        name: 'Geography',
      },
      { name: 'Web development' },
      {
        name: 'Data Science',
      },
      { name: 'Filming' },
    ],
  });
  console.log('done ...');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
