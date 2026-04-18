const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const restaurantCount = await prisma.restaurant.count();
    const users = await prisma.user.findMany({ select: { fullName: true, email: true, role: true, createdAt: true } });
    const restaurants = await prisma.restaurant.findMany({ select: { name: true, status: true, createdAt: true } });

    console.log('User Count:', userCount);
    console.log('Restaurant Count:', restaurantCount);
    console.log('\nUsers:', JSON.stringify(users, null, 2));
    console.log('\nRestaurants:', JSON.stringify(restaurants, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
