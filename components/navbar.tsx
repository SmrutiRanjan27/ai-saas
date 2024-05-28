import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import { getCredits } from "@/lib/credits";
import { checkSubscription } from "@/lib/subscription";

const Navbar = async () => {
    const credits = await getCredits();
    const isPro = await checkSubscription();
    return (
        <div className="flex items-center justify-between px-4 py-2">
            <MobileSidebar isPro={isPro} credits={credits} />
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}

export default Navbar;