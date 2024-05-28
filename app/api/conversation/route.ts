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
        const {messages} = body;
        
        const credits = creditsPerRequest.conversation;
        const isPro = await checkSubscription();

        if (!userId) {
            return new NextResponse("Unauthorized", {status:401});
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not configured", {status:500});
        }

        if (!messages) {
            return new NextResponse("No messages provided", {status:400});
        }

        if (!isPro) {
            const enoughCredits = await checkCredits(credits);
            if (!enoughCredits) {
                return new NextResponse("Not enough credits", {status: 403});
            }
        }

        const response = await openai.chat.completions.create({
            messages,
            model: 'gpt-3.5-turbo',
        });

        if (!isPro) {  
            await updateCredits(credits);
        }

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", {status:500});
    }
}