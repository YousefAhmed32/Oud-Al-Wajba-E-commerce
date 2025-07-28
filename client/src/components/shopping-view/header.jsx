// ShoppingHeader.jsx
import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItem } from "@/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-warpper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(item) {
    sessionStorage.removeItem("filters");

    const currentFilter =
      item.id !== "home" && item.id !== "products" && item.id !== "search"
        ? { category: [item.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter
      ? setSearchParams(new URLSearchParams(`?category=${item.id}`))
      : navigate(item.path);
  }

  return (
 <nav className="flex flex-col lg:flex-row gap-6 lg:items-center">
  {shoppingViewHeaderMenuItem.map((item) => (
    <Label
      key={item.id}
      onClick={() => handleNavigate(item)}
      className="relative group text-[15px] font-semibold text-white cursor-pointer transition-all duration-300"
    >
      <span className="relative px-3 py-1 block z-10 group-hover:text-gray-300 transition-colors duration-300">

        {item.label}

        {/* الخط من الأعلى مع glow وانحناء */}
        <span className="absolute top-0 left-1/2 w-0 h-[3px] rounded-full  bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 group-hover:shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]" />

        {/* الخط من الأسفل مع glow وانحناء */}
        <span className="absolute bottom-0 left-1/2 w-0 h-[3px] rounded-full  bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 group-hover:shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]" />

        {/* الخط من اليسار مع glow وانحناء */}
        <span className="absolute top-1/2 left-0 h-0 w-[3px] rounded-full  bg-white transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]" />

        {/* الخط من اليمين مع glow وانحناء */}
        <span className="absolute top-1/2 right-0 h-0 w-[3px] rounded-full  bg-white transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]" />

      </span>
    </Label>
  ))}
</nav>


  );
}

function HeaderRightContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [user, dispatch]);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Cart */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-800 transition"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
          <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md">
            {cartItems?.items?.length || 0}
          </span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {/* User Menu */}
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-white border-[1px] border-t-cyan-300">
            <AvatarFallback className="text-black font-bold">
              {user?.userName?.slice(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
   <DropdownMenuContent
  side="right"
  className="w-80 mt-3 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-black/80 text-white shadow-2xl backdrop-blur-md ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 px-5 py-4"
>
  <DropdownMenuLabel className="text-xs uppercase tracking-widest text-gray-400 mb-2">
    Welcome back 👋
  </DropdownMenuLabel>

  <div className="mb-4  mt-4 flex items-center gap-4">
    <Avatar className="h-10 w-10 border-2 border-cyan-400 shadow-cyan-500/50 shadow-lg">
      <AvatarFallback className="text-slate-500 font-bold text-xl">
        {user?.userName?.slice(0, 2).toUpperCase() || "??"}
      </AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <span className="text-base font-semibold text-white drop-shadow-md">
        {user?.userName}
      </span>
      <span className="text-xs text-gray-300">🌟 You're logged in</span>
    </div>
  </div>

  <DropdownMenuItem
    onClick={() => navigate("/shop/account")}
    className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:shadow-md transition-all duration-200"
  >
    <UserCog className="h-5 w-5 text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform" />
    <span className="text-sm group-hover:text-cyan-300">Account Settings</span>
  </DropdownMenuItem>

  <DropdownMenuSeparator className="my-3 border-t border-gray-700" />

  <DropdownMenuItem
    onClick={handleLogout}
    className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 hover:shadow-md transition-all duration-200"
  >
    <LogOut className="h-5 w-5 text-red-400 group-hover:rotate-12 group-hover:text-red-300 transition-transform" />
    <span className="text-sm group-hover:text-red-300">Logout</span>
  </DropdownMenuItem>
</DropdownMenuContent>



      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header
      className="sticky top-0 z-40 w-full shadow-md"
      style={{
        background: "linear-gradient(to right, #000000, #1a1a1a)",
      }}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/shop/home"
          className="flex items-center gap-2 text-white text-xl font-bold tracking-widest hover:opacity-90"
        >
          <HousePlug className="w-6 h-6" />
          <span>ÉLÉGANCE</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white lg:hidden"
            >
              <Menu />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-xs pt-6 bg-black text-white"
          >
            <SheetTitle></SheetTitle>
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
