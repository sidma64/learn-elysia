import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = new Elysia();

app.get('/', async () => await prisma.user.count());
app.get('/users', async () => await prisma.user.findMany());
app.post(
    '/users',
    async ({ body }) => {
        const { username, email, password } = body;
        const hashedPassword = await Bun.password.hash(password);
        if (await prisma.user.findUnique({ where: { email: email } })) {
            throw new Error('Email already exists');
        }
        if (await prisma.user.findUnique({ where: { name: username } })) {
            throw new Error('Username already exists');
        }

        return await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword,
            },
        });
    },
    {
        body: t.Object({
            username: t.String(),
            email: t.String(),
            password: t.String(),
        }),
    }
);

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
