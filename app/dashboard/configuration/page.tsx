import { ConfigurationForm } from "@/components/configuration/configuration-form";
import { ConfigurationList } from "@/components/configuration/configuration-list";
import { getConfiguration } from "@/lib/configuration";
import { Settings } from "lucide-react";

const ConfigurationPage = async () => {
  // bg-[#EEEDF5]
  const configuration = await getConfiguration();
  return (
    <main className="flex w-full h-full p-6 items-center flex-col ">
      <section className="bg-white rounded-md m-2 p-6 w-full h-full flex lg:flex-row lg:justify-between lg:gap-x-6 flex-col gap-y-4">
        <div className=" w-full lg:w-[65%] h-full flex flex-col gap-y-6">
          <h1 className="flex gap-x-2 text-[17px] font-bold text-blue-950">
            <Settings size={22} />
            Configuration
          </h1>
          <ConfigurationForm />
        </div>
        {!!configuration && (
          <div className="w-full lg:w-[30%] h-full flex flex-col justify-center gap-y-6 py-4 pt-4 bg-[#FFFAF6] rounded-md">
            <ConfigurationList configuration={configuration} />
          </div>
        )}
      </section>
    </main>
  );
};

export default ConfigurationPage;
