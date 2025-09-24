import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

import { SignOut } from "./sign-out";

export const Sidebar = async () => {
  return (
    <div className="flex flex-col overflow-y-auto pb-4 h-full bg-[#17203F]   shadow-xl">
      <div className="p-4 pb-0">
        <Logo />
      </div>
      <div className="flex flex-col w-full flex-1 -mt-3">
        <SidebarRoutes />
      </div>
      <SignOut />
    </div>
  );
};
