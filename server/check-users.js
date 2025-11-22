const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking for users...');

    try {
        const users = await prisma.user.findMany();

        if (users.length === 0) {
            console.log('❌ No users found in the database.');
        } else {
            console.log(`✅ Found ${users.length} user(s):`);
            users.forEach(user => {
                console.log(`- Name: ${user.fullName}, Email: ${user.email}, ID: ${user.id}`);
            });
        }

    } catch (error) {
        console.error('❌ Error querying database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
