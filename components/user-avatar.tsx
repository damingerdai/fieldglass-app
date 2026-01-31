import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import gravatar from "@/lib/gravatar";
import { User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  email: string;
  className?: string;
}

const getAvatarColor = (email: string) => {
  const colors = [
    "bg-purple-100 text-purple-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-rose-100 text-rose-600",
    "bg-amber-100 text-amber-600",
  ];
  if (!email) return colors[0];
  const charCodeSum = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ email, className }) => {
  const url: string | undefined = email ? gravatar(email) : undefined;
  const initial = email ? email.charAt(0).toUpperCase() : null;
  const colorClass = getAvatarColor(email);

  return (
    <Avatar className={cn("h-full w-full border-none rounded-xl", className)}>
      {url && <AvatarImage src={url} alt={email ?? "User"} className="rounded-xl" />}
      <AvatarFallback
        className={cn(
          "rounded-xl font-bold text-[13px] transition-colors",
          !url && colorClass
        )}
      >
        {initial || <UserIcon className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  )
}