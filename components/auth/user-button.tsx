"use client";
import { User, Settings, Bolt } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { SignOut } from "@/app/dashboard/_components/sign-out";
import { Configuration } from "@prisma/client";
import { useCurrentUser } from "@/hooks/use-current-user";

import { useModal } from "@/hooks/modal-store";
import { useEffect } from "react";
interface UserButtonInterface {
  config: Configuration | null;
}
export const UserButton = ({ config }: UserButtonInterface) => {
  const user = useCurrentUser();
  const { onOpen } = useModal();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "P" || e.key === "p") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen("profile");
      }
      if ((e.key === "G" || e.key === "g") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen("gestion", { config: config });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [config, onOpen]);
  return (
    <DropdownMenu>
      <div className="flex items-center flex-row-reverse gap-x-2 hover:bg-neutral-100 p-1.5 px-3 rounded-md">
        <DropdownMenuTrigger className=" outline-none flex gap-x-2 flex-row-reverse items-center">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-primary_purpule">
              <span className="flex items-center justify-center font-bold text-white text-[20px]">
                {user?.email ? (
                  `${user.email[0]}`
                ) : (
                  <User className="text-white h-5 w-5 " />
                )}
              </span>
            </AvatarFallback>
          </Avatar>
          <p>{user?.prenom}</p>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56 mr-2 ">
        <DropdownMenuLabel className="flex items-center text-[16px]">
          <Settings className="h-4 w-4 mr-2" /> Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-[15px] flex items-center cursor-pointer pr-0"
          onClick={() => onOpen("profile")}
        >
          <User className="h-4 w-4 mr-1.5" />
          Profile
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 ml-auto rounded border bg-muted px-1.5 mr-0 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">CTRL P</span>
          </kbd>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-[14px] flex items-center cursor-pointer pr-0"
          onClick={() => onOpen("gestion", { config: config })}
        >
          <Bolt className="h-4 w-4 mr-1.5" />
          Gestion Avancée
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 ml-auto rounded border bg-muted px-1.5 mr-0 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">CTRL G</span>
          </kbd>
        </DropdownMenuItem>
        <SignOut navbar />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
