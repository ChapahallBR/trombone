import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // You'll need to install this
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Register
router.post('/signup', async (req, res) => {
    try {
        const { email, password, fullName, cpf } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { cpf }] }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                cpf
            }
        });

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

export default router;
