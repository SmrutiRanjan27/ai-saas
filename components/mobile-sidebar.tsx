"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from "@/components/sidebar";

interface MobileSidebarProps {
    credits: number;
    isPro: boolean;
}

const MobileSidebar = ({
    credits,
    isPro
}: MobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar isPro={isPro} credits={credits}/>
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar;