import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { swagger } from '@elysiajs/swagger';

const db = new PrismaClient();

const app = new Elysia();

const messageObject = t.Object({
    message: t.String(),
});

const indexSchema = {
    response: {
        200: messageObject,
    },
};

const helloWorld = () => {
    return { message: 'Hello World!' };
};

const signupSchema = {
    body: t.Object({
        email: t.String(),
        username: t.String(),
        password: t.String(),
    }),
};

const signup = async (req: any) => {
    const { email, username, password } = req.body;
    db.user.create({
        data: {
            email,
            username,
            password,
        },
    });
};

app.use(swagger())
    .get('/', helloWorld, indexSchema)
    .listen(Bun.env.PORT || 3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
