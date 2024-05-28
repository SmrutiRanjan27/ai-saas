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

        const credits = creditsPerRequest.video;
        const isPro = await checkSubscription();

        if (!userId) {
            return new NextResponse("Unauthorized", {status:401});
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", {status:400});
        }

        const input = {
            prompt: prompt,
        };
        
        if (!isPro) {
            const enoughCredits = await checkCredits(credits);
            if (!enoughCredits) {
                return new NextResponse("Not enough credits", {status: 403});
            }
        }

        const output = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", { input });
        
        if (!isPro) {
            await updateCredits(credits);
        }

        return NextResponse.json(output);

    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return new NextResponse("Internal error", {status:500});
    }
}