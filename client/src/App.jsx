import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";

import AuthLogin from "./Pages/auth/login";
import AuthRegister from "./Pages/auth/register";

import AdminLayout from "./components/admin-view/layout";

import AdminDashboard from "./Pages/admin-view/feature";
import AdminFeatures from "./Pages/admin-view/feature";
import AdminOrders from "./Pages/admin-view/orders";
import AdminProducts from "./Pages/admin-view/products";

import NotFound from "./Pages/not-found";
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./Pages/shopping-view/home";
import ShoppingListing from "./Pages/shopping-view/listing";
import ShoppingAccount from "./Pages/shopping-view/account";
import ShoppingCheckout from "./Pages/shopping-view/checkout";

import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./Pages/unauth-page";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "./components/ui/skeleton";
import { fetchCartItems } from "./store/shop/cart-slice";

import PaypalReturnPage from "./Pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./Pages/shopping-view/payment-success";
import SearchProducts from "./Pages/shopping-view/search";
import AdminAnalysis from "./Pages/admin-view/analysis";
import AdminCoupon from "./Pages/admin-view/coupon";

function App() {
  const { user, isAuthenticated, isloading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

   useEffect(() => {
    
    if (user?.id) {
      dispatch(fetchCartItems(user.id)); 
    }
  }, [user, dispatch]);

  if (isloading)
    return <Skeleton className="h-[200px] bg-black w-[600px] rounded-full" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
        path="/"
         element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            
            </CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="analysis" element={<AdminAnalysis />} />
          <Route path="coupon" element={<AdminCoupon />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
