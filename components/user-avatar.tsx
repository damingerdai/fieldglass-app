import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import gravatar from "@/lib/gravatar";

interface UserAvatarProps {
    email: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ email }) => {
    const url: string = gravatar(email);

    return <Avatar className="border">
        <AvatarImage src={url} alt={email} />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
}