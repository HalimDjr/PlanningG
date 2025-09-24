import { cn } from "@/lib/utils";
import Image from "next/image";
import { Poppins } from "next/font/google";
const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "700", "900"],
});
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className={cn(
        "grid place-content-center  bg-slate-100 h-full w-full ",
        font.className
      )}
    >
      {children}
      <Image
        src="/login_1.svg"
        className="hidden lg:block absolute bottom-0 left-0 w-[25%]"
        height={500}
        width={500}
        alt="login1"
      />
      <Image
        src="/login_2.svg"
        className="hidden lg:block absolute bottom-0 right-0 w-[25%]"
        height={500}
        width={500}
        alt="login2"
      />
    </main>
  );
};

export default AuthLayout;
