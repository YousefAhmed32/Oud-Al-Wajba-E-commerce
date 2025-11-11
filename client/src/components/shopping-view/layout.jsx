import ShoppingHeader from "./header";
import Footer from "./footer";
import { Outlet, useLocation } from "react-router-dom";

function ShoppingLayout() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-1">
        <Outlet key={location.pathname} />
      </main>
      <Footer />
    </div>
  );
}



export default ShoppingLayout;


