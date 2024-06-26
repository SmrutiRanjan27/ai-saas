import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { AvatarImage } from "./ui/avatar"

export const BotAvatar = () => {
    return (
        <Avatar className="h-8 w-8">
            <AvatarImage className="p-1" src="./logo.png" />
            <AvatarFallback>G</AvatarFallback>
        </Avatar>
    )
}