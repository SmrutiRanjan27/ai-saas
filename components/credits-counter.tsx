"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_CREDITS } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface CreditsCounterProps {
    credits: number;
    isPro: boolean;
}

export const CreditsCounter = ({credits = 0, isPro = false}: CreditsCounterProps) => {
    const proModal = useProModal();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    if (isPro) {
        return null;
    }

    return (
        <div className="px-3">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6">
                    <div className="text-center text-sm text-white mb-4 space-y-2">
                        <p>
                            {credits} / {MAX_FREE_CREDITS} credits available
                        </p>
                        <Progress
                            className="h-3"
                            value={(credits / MAX_FREE_CREDITS) * 100}
                        />
                    </div>
                    <Button 
                        onClick={proModal.onOpen}
                        className="w-full"
                        variant="premium"
                    >
                        Upgrade
                        <Zap className="h-4 w-4 ml-2 fill-white"/>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}