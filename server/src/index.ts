import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import reportRoutes from './routes/reports';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'OnSpace API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
