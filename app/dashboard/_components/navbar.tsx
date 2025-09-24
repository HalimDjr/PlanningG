import { UserButton } from "@/components/auth/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { getDepartement } from "@/lib/departement";
import { getConfiguration } from "@/lib/configuration";

export const Navbar = async () => {
  const departement = await getDepartement();
  const config = await getConfiguration();
  return (
    <div className="border-b p-4 bg-white shadow-md flex items-center flex-row-reverse justify-between h-full w-full z-50">
      <MobileSidebar />
      <UserButton config={config} />
      {!!departement && (
        <h1 className="text-base font-bold text-primary_blue mx-4 md:text-[19px]">
          Département {departement.nom}
        </h1>
      )}
    </div>
  );
};
