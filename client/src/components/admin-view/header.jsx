import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/store/auth-slice";
import { useDispatch } from "react-redux";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#000000] border-b border-gray-700 shadow-md">
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-2 rounded-md"
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
