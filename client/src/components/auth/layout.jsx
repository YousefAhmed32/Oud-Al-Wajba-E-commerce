import { Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <main className="flex flex-col w-full flex-1">
        {/* المفتاح يضمن إعادة render لكل route جديد */}
        <Outlet key={location.pathname + location.search} />
      </main>
    </div>
  );
}

export default AuthLayout;
