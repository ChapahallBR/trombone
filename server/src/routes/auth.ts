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

        // Check if email exists
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ error: 'Este email já está cadastrado.' });
        }

        // Check if CPF exists
        if (cpf) {
            const existingCpf = await prisma.user.findUnique({ where: { cpf } });
            if (existingCpf) {
                return res.status(400).json({ error: 'Este CPF já está cadastrado.' });
            }
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
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Erro ao criar usuário. Tente novamente.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado. Verifique o email ou cadastre-se.' });
        }

        if (!user.password) {
            return res.status(400).json({ error: 'Esta conta não possui senha configurada.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro ao fazer login. Tente novamente.' });
    }
});

export default router;
