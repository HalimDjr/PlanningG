import { SessionProvider } from "next-auth/react";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { ModalProvder } from "@/hooks/modal-provider";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "700", "900"],
});
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <main className={cn(" h-full overflow-y-auto ", font.className)}>
        <nav className="w-full flex fixed md:pl-52 h-[75px] inset-y-0 z-50">
          <Navbar />
        </nav>
        <aside className="hidden md:flex flex-col fixed inset-y-0 z-50 w-52 md:w-[208px]">
          <Sidebar />
        </aside>
        <section className="md:ml-52  h-full pt-[75px] max-w-full z-10 bg-[#F5F6FB] ">
          <ModalProvder />
          {children}
        </section>
      </main>
    </SessionProvider>
  );
};

export default DashboardLayout;
