import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PT_Serif } from "next/font/google";
export const font = PT_Serif({
  subsets: ["latin"],
  weight: ["700"],
});
export const Logo = () => {
  return (
    <Link className="flex justify-start mb-5" href={"/dashboard"}>
      <Image src={"/logo.png"} alt="cypress Logo" width={90} height={75} />
      {/* <spa6
        className={cn(
          "font-bold dark:text-white  text-3xl first-letter:ml-2 text-white",
          font.className
        )}
      >
        Plan
      </spa6> */}
    </Link>
  );
};
