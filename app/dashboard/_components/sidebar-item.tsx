"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "700", "900"],
});

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const SidebarItem = ({ label, icon: Icon, href }: SidebarItemProps) => {
  const pathname = usePathname();

  // const isActive =
  //   (href === "/" && pathname === "/") ||
  //   href === pathname ||
  //   pathname?.startsWith(`${href}/`);
  const isActive = href === pathname;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-2 text-slate-300 text-sm font-[500] pl-6 pb-1 transition-all hover:text-white hover:bg-slate-300/20 hover:mx-2 hover:rounded-md",
        font.className,
        isActive && "text-white bg-slate-300/20 mx-2 rounded-md "
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon size={20} className={cn(isActive && "text-white ")} />
        {label}
      </div>
      {/* <div
        className={cn(
          "ml-auto opacity-0 border-[3px] border-primary_purpule rounded-s h-full transition-all",
          isActive && "opacity-100"
        )}
      /> */}
    </Link>
  );
};
