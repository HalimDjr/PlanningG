"use client";

import {
  DoorOpen,
  HomeIcon,
  User,
  UserCog,
  CalendarCheck,
  Settings,
  Users,
  Palette,
  GraduationCap,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const adminRoutes = [
  {
    icon: HomeIcon,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: User,
    label: "Enseignant",
    href: "/dashboard/enseignants",
  },
  {
    icon: UserCog,

    label: "Etudiant",
    href: "/dashboard/etudiants",
  },
  {
    icon: Users,

    label: "Binomes",
    href: "/dashboard/binomes",
  },
  {
    icon: DoorOpen,

    label: "Salles",
    href: "/dashboard/salles",
  },
  {
    icon: Palette,

    label: "Thèmes",
    href: "/dashboard/themes",
  },
  {
    icon: GraduationCap,

    label: "Affectation",
    href: "/dashboard/affectation",
  },
  {
    icon: CalendarCheck,

    label: "Calendrier",
    href: "/dashboard/calendrier",
  },
];

export const SidebarRoutes = () => {
  const routes = adminRoutes;
  const pathname = usePathname();
  const href = "/dashboard/configuration";
  const isActive = href === pathname;

  return (
    <nav className="flex flex-col w-full pt-2">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
      <div className="h-[1px] bg-slate-300 rounded-md m-2" />
      <Link
        href={href}
        className={cn(
          "flex items-center gap-x-2 text-slate-300 text-[15px] font-[500] pl-6 pb-1 transition-all hover:text-white hover:bg-slate-300/20 hover:mx-2 hover:rounded-md",

          isActive && "text-white bg-slate-300/20 mx-2 rounded-md "
        )}
      >
        <div className="flex items-center  gap-x-2 py-4">
          <Settings size={20} className={cn(isActive && "text-white")} />
          {"Configuration"}
        </div>
        {/* <div
          className={cn(
            "ml-auto opacity-0 border-[3px] border-[#5454dd] rounded-s h-full transition-all",
            isActive && "opacity-100"
          )}
        /> */}
      </Link>
    </nav>
  );
};
