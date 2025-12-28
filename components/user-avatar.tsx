import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import gravatar from "@/lib/gravatar";
import { User as UserIcon } from "lucide-react"

interface UserAvatarProps {
    email: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ email }) => {
   const url: string | undefined = email ? gravatar(email) : undefined;
   const initials = email ? email.slice(0, 2).toUpperCase() : null;

    return <Avatar className="border">
       {url && <AvatarImage src={url} alt={email ?? "User"} />}
      <AvatarFallback className="bg-muted">
        {initials || <UserIcon className="h-4 w-4 text-muted-foreground" />}
      </AvatarFallback>
    </Avatar>
}