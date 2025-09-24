"use client";
import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, LogOutIcon } from "lucide-react";

interface signoutProps {
  navbar?: boolean;
}
export const SignOut = ({ navbar }: signoutProps) => {
  const onClick = () => {
    logout();
  };

  if (navbar) {
    return (
      <DropdownMenuItem
        className="text-[15px] flex items-center cursor-pointer"
        onClick={onClick}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </DropdownMenuItem>
    );
  }
  return (
    <Button
      asChild
      type="button"
      onClick={onClick}
      variant={"ghost"}
      className="flex items-center justify-start text-slate-300 text-[1rem] font-[500] pl-6   transition-all hover:text-white hover:bg-slate-300/20 hover:mx-2 hover:rounded-md mb-auto cursor-pointer"
    >
      <div className="flex items-center gap-x-2 ">
        <LogOutIcon size={25} className="text-slate-300 hover:text-white" />
        {"signOut"}
      </div>
    </Button>
  );
};
