import prisma from '@/config/db';
import { hashPassword, comparePassword } from '../../utils/hash';
import { signToken } from '../../utils/jwt';
import { User } from '@prisma/client';

export class AuthService {
    async register(data: any) {
        const { email, password, name, level } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                level: level || 'N5',
            },
        });

        const token = signToken({ id: user.id, email: user.email });

        return { user, token };
    }

    async login(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = signToken({ id: user.id, email: user.email });

        return { user, token };
    }
}
