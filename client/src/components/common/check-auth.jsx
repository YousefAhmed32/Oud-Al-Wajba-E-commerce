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
    // Save the intended path to redirect back after login
    return <Navigate to="/auth/login" state={{ from: path }} replace />;
  }

  // Redirect authenticated users away from login/register
  if (isAuthenticated && (path.includes("/login") || path.includes("/register"))) {
    // Check if there's a saved path to redirect to
    const savedPath = location.state?.from;
    
    if (savedPath && !savedPath.includes("/auth")) {
      // Redirect to the saved path
      return <Navigate to={savedPath} replace />;
    }
    
    // Default redirect based on user role
    return user?.role === "admin"
      ? <Navigate to="/admin/analysis" replace />
      : <Navigate to="/shop/home" replace />;
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
