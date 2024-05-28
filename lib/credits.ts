import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { MAX_FREE_CREDITS } from "@/constants";

export const updateCredits = async (credits: number) => {
    const { userId } = auth();
    if (!userId) {
        return {success: false, message: "Unauthorized", status: 401};
    }

    const user = await prismadb.user.findUnique({
        where: {
            userId,
        },
    });

    if (!user) {
        await prismadb.user.create({
            data: {
                userId,
                credits: MAX_FREE_CREDITS - credits,
            },
        });
        return {success: true, message: "Created new user", status: 200};
    }

    await prismadb.user.update({
            where: {
                userId
            },
            data: {
                credits: user.credits - credits,
            },
        });
    return {success: true, message: "Updated credits", status: 200}; 
}

export const checkCredits = async (credits: number) => {
    const { userId } = auth();
    if (!userId) {
        return {success: false, message: "Unauthorized", status: 401};
    }

    const user = await prismadb.user.findUnique({
        where: {
            userId,
        },
    });

    if (!user || credits <= user.credits) {
        return true;
    } else {
        return false;
    }
}

export const getCredits = async () => {
    const { userId } = auth();
    if (!userId) {
        return 0;
    }
    const user = await prismadb.user.findUnique({
        where: {
            userId,
        },
    });
    if (!user) {
        return 0;
    }
    return user.credits;
}