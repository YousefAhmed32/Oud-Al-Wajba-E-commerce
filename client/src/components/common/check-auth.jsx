import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  console.log(path, isAuthenticated);

  // Redirect from root path
  if (path === "/") {
    return <Navigate to="/auth/login" />;
  }

  // Public routes allowed without authentication
  const publicRoutes = ["/auth/login", "/auth/register", "/paypal-return", "/payment-success"];
  const isPublic = publicRoutes.some(route => path.includes(route));

  // Block access to private routes if not authenticated
  if (!isAuthenticated && !isPublic) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect authenticated users away from login/register
  if (isAuthenticated && (path.includes("/login") || path.includes("/register"))) {
    return user?.role === "admin"
      ? <Navigate to="/admin/analysis" />
      : <Navigate to="/shop/home" />;
  }

  // Prevent normal users from accessing admin routes
  if (isAuthenticated && user?.role !== "admin" && path.includes("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  // Prevent admin users from accessing shop routes
  if (isAuthenticated && user?.role === "admin" && path.includes("/shop")) {
    return <Navigate to="/admin/analysis" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
