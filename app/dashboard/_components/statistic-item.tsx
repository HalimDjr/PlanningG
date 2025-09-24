import { cn } from "@/lib/utils";
import {
  DoorOpen,
  PaletteIcon,
  Users,
  UsersRound,
  GraduationCap,
} from "lucide-react";

interface StatisticItemProps {
  text: string;
  icon: string;
  textColor: string;
  bg: string;
  lightBg: string;
  width?: string;
  nb: number;
}
export const StatisticItem = ({
  bg,
  icon,
  textColor,
  lightBg,
  text,
  width,
  nb,
}: StatisticItemProps) => {
  const iconMap = {
    users: Users,
    DoorOpen: DoorOpen,
    PaletteIcon: PaletteIcon,
    UsersRound: UsersRound,
    GraduationCap: GraduationCap,
  };
  const DynamicIcon = iconMap[icon as keyof typeof iconMap] || Users;
  return (
    <>
      <div className="w-[190px] h-[90px] bg-white rounded-lg shadow-md p-2 flex flex-col justify-center relative ">
        <div className="flex gap-x-4 items-center">
          <span
            className={cn(
              "rounded-lg  p-3  flex items-center justify-center",
              `bg-[${lightBg}]`
            )}
          >
            <DynamicIcon className={cn("size-6 ", `text-[${textColor}]`)} />
          </span>
          <div className="flex- flex-col ">
            <p className="text-xl font-semibold ">{nb}</p>
            <p className="text-slate-700 ">{text}</p>
          </div>
        </div>
        <div
          className={cn(
            " w-1 h-14 rounded-3xl   absolute right-0",
            `bg-[${bg}]`,
            width ? width : ""
          )}
        />
      </div>
    </>
  );
};
