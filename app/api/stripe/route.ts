import {auth, currentUser} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import {stripe} from "@/lib/stripe";
import { absoluteURL } from "@/lib/utils";

const settingsURL = absoluteURL("/settings");

export async function GET() {
    try {
        const {userId} = auth();
        const user = await currentUser();

        if(!userId || !user) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const userSubscription = await prismadb.userSubscription.findUnique({
            where : {
                userId
            }
        });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsURL,
            });
            return new NextResponse(JSON.stringify({url : stripeSession.url}));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            success_url: settingsURL,
            cancel_url: settingsURL,
            billing_address_collection: "required",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data : {
                        currency: "INR",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited credits"
                        },
                        unit_amount: 200000,
                        recurring: {
                            interval: "month",
                        }
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            }
        });

        return new NextResponse(JSON.stringify({url : stripeSession.url}));
    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal error", {status: 500})
    }
}