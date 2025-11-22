import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create Report
router.post('/', async (req, res) => {
    try {
        const { title, description, latitude, longitude, category, userId, imageUrl, address, userEmail, userName } = req.body;

        // Ensure user exists (Sync with Supabase)
        if (userId && userEmail) {
            await prisma.user.upsert({
                where: { id: userId },
                update: { email: userEmail, fullName: userName },
                create: {
                    id: userId,
                    email: userEmail,
                    fullName: userName
                }
            });
        }

        const report = await prisma.report.create({
            data: {
                title,
                description,
                latitude,
                longitude,
                category,
                userId,
                imageUrl,
                address,
                status: 'pendente'
            }
        });

        res.status(201).json(report);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Error creating report' });
    }
});

// Get All Reports
router.get('/', async (req, res) => {
    try {
        const reports = await prisma.report.findMany({
            include: { user: { select: { fullName: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reports' });
    }
});

// Get User Reports
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const reports = await prisma.report.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user reports' });
    }
});

export default router;
