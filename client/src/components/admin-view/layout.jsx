import { Outlet } from "react-router-dom";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex flex-col flex-1 p-3 sm:p-4 md:p-6 text-foreground bg-background overflow-x-hidden">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
