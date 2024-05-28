import {PrismaClient} from "@prisma/client";

declare global {
    var prismaa: PrismaClient | undefined;
}

const prismadb = global.prismaa || new PrismaClient();

if (process.env.NODE_ENV === "production") {
    global.prismaa = prismadb;
}

export default prismadb;