import {
  BadgeCheck,
  ChartLine,
  ShoppingBasket,
  TicketPercent,
  LogOut,
  HelpCircle,
  Images,
} from "lucide-react";
import { ChartNoAxesCombined } from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  { id: "analysis", label: "Analysis", path: "/admin/analysis", icon: ChartLine },
  { id: "Feature", label: "Feature", path: "/admin/features", icon: Images  },
  { id: "products", label: "Products", path: "/admin/products", icon: ShoppingBasket },
  { id: "orders", label: "Orders", path: "/admin/orders", icon: BadgeCheck },
  { id: "coupon", label: "Coupon", path: "/admin/coupon", icon: TicketPercent },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex flex-col mt-8 space-y-3">
      {adminSidebarMenuItems.map((menuItem) => {
        const Icon = menuItem.icon;
        const active = location.pathname === menuItem.path;

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`relative flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all
              ${
                active
                  ? "bg-gradient-to-r from-emerald-500/30 to-emerald-700/20 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
          >
            {/* Thin neon line indicator */}
            {active && (
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r shadow-[0_0_12px_#10b981]" />
            )}
            <Icon className={`w-5 h-5 ${active ? "text-emerald-300" : "text-emerald-500/70"}`} />
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* ✅ Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 bg-[#0B0F19]/95 backdrop-blur-2xl border-r border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
        >
          <div className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 mt-4 text-lg font-bold text-white">
                <ChartNoAxesCombined size={28} className="text-emerald-400" />
                <span className="tracking-wide">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>

            <MenuItems setOpen={setOpen} />

            <div className="mt-auto border-t border-white/10 pt-6 px-4">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                <HelpCircle size={18} /> Help
              </button>
              <button className="flex items-center gap-2 mt-3 text-red-400 hover:text-red-300">
                <LogOut size={18} /> Logout
              </button>
              <p className="mt-6 text-xs text-gray-500">© 2025 Startup Labs</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ✅ Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 p-6 bg-black backdrop-blur-2xl border-r border-emerald-500/30 ">
        {/* Logo */}
        <div
          onClick={() => navigate("/admin/features")}
          className="flex items-center gap-2 cursor-pointer mb-8"
        >
          <ChartNoAxesCombined size={30} className="text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-wide">Startup Admin</h1>
        </div>

        <MenuItems />

        {/* Footer */}
        <div className="mt-auto border-t border-white/10 pt-6 text-gray-400 text-xs">
          <p className="mb-1">Version 1.3.0</p>
          <p>© 2025 Startup Labs</p>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
