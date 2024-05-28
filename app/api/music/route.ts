import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { updateCredits, checkCredits } from '@/lib/credits';
import { creditsPerRequest } from '@/constants';
import { checkSubscription } from '@/lib/subscription';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export async function POST(
    req: Request
) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {prompt} = body;

        const credits = creditsPerRequest.music;
        const isPro = await checkSubscription();

        if (!userId) {
            return new NextResponse("Unauthorized", {status:401});
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", {status:400});
        }

        const input = {
            prompt_b: prompt
        };

        if (!isPro) {
            const enoughCredits = await checkCredits(credits);
            if (!enoughCredits) {
                return new NextResponse("Not enough credits", {status: 403});
            }
        }
        
        const output = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", { input });
        
        if (!isPro) {
            await updateCredits(credits);
        }
        
        return NextResponse.json(output);

    } catch (error) {
        console.log("[MUSIC_ERROR]", error);
        return new NextResponse("Internal error", {status:500});
    }
}