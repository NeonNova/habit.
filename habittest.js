// checkHabit.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const habitName = 'hmm';

  // Retrieve the first habit that matches the specified name
  const habit = await prisma.habit.findFirst({
    where: { name: habitName },
  });

  if (!habit) {
    console.log('Habit not found');
    return;
  }

  console.log('Habit details:', habit);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
