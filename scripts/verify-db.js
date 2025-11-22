const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Connecting to database...');

    try {
        const count = await prisma.report.count();
        console.log(`✅ Connected! Total reports: ${count}`);

        const recentReports = await prisma.report.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        fullName: true
                    }
                }
            }
        });

        if (recentReports.length === 0) {
            console.log('No reports found yet.');
        } else {
            console.log('\n📋 Recent Reports:');
            recentReports.forEach(report => {
                console.log(`- [${report.status.toUpperCase()}] ${report.title} (${report.category})`);
                console.log(`  By: ${report.user?.fullName || 'Unknown'} (${report.user?.email || 'No Email'}) at ${report.createdAt.toLocaleString()}`);
            });
        }

    } catch (error) {
        console.error('❌ Error connecting to database:', error);
    } finally {
        await prisma.disconnect();
    }
}

main();
