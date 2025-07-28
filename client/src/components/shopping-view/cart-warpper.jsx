import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent
      className="sm:max-w-md bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] 
      text-white border border-blue-800 rounded-2xl shadow-[0_0_20px_#4f46e5]
      backdrop-blur-lg animate-in slide-in-from-right p-6 transition-all duration-500"
    >
      <SheetHeader>
        <SheetTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-wide drop-shadow-lg">
          🛒 Your Cart
        </SheetTitle>
      </SheetHeader>

      <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto 
        scrollbar-thin scrollbar-thumb-purple-500 hover:scrollbar-thumb-pink-500 pr-2">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent
              key={item.productId?._id || item.productId}
              cartItem={item}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 italic animate-pulse">Your cart is empty 🚀</p>
        )}
      </div>

      <div className="mt-8 space-y-4 border-t border-gray-600 pt-4">
        <div className="flex justify-between text-xl font-semibold text-white">
          <span>Total</span>
          <span className="text-green-400">${totalCartAmount.toFixed(2)}</span>
        </div>

        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full py-3 bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 
          hover:from-pink-600 hover:to-blue-700 transition-all duration-500 text-white 
          text-lg font-bold rounded-xl shadow-xl hover:scale-105 active:scale-95"
        >
          🚀 Proceed to Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
