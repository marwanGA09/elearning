const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

const main = async () => {
  console.log('start ...');
  await db.category.createMany({
    data: [
      {
        name: 'Engineering',
      },
      {
        name: 'Photography',
      },
      {
        name: 'Fitness',
      },
      {
        name: 'Accounting',
      },
      // { name: 'Web development' },
      {
        name: 'Computer science',
      },
      // { name: 'Filming' },
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
