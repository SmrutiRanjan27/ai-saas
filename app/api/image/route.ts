import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { updateCredits, checkCredits } from '@/lib/credits';
import { creditsPerRequest } from '@/constants';
import { checkSubscription } from '@/lib/subscription';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export async function POST(
    req: Request
) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {prompt, amount = 1, resolution = "256x256"} = body;

        const credits = creditsPerRequest.image;
        const isPro = await checkSubscription();

        if (!userId) {
            return new NextResponse("Unauthorized", {status:401});
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not configured", {status:500});
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", {status:400});
        }

        if (!amount) {
            return new NextResponse("Amount is required", {status:400});
        }

        if (!resolution) {
            return new NextResponse("Resolution is required", {status:400});
        }

        if (!isPro) {
            const enoughCredits = await checkCredits(credits);
            if (!enoughCredits) {
                return new NextResponse("Not enough credits", {status: 403});
            }
        }

        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
            quality: "standard"
        });

        if (!isPro) {
            await updateCredits(credits);
        }
        
        return NextResponse.json(response.data);

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", {status:500});
    }
}