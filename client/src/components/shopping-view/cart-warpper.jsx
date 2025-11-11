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
      className="sm:max-w-md luxury-gradient 
      text-white border elegant-border rounded-2xl shadow-[0_0_20px_rgba(210,176,101,0.3)]
      backdrop-blur-lg animate-in slide-in-from-right p-6 transition-all duration-500"
    >
      <SheetHeader>
        <SheetTitle className="text-3xl font-extrabold text-gold-950 tracking-wide glow-text">
          🛒 سلة التسوق
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
          <p className="text-center text-gold-300 italic animate-pulse">سلة التسوق فارغة 🚀</p>
        )}
      </div>

      <div className="mt-8 space-y-4 border-t elegant-border pt-4">
        <div className="flex justify-between text-xl font-semibold text-white">
          <span>المجموع</span>
          <span className="text-gold-950">QR{totalCartAmount.toFixed(2)}</span>
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenCartSheet(false);
            setTimeout(() => {
              navigate("/shop/checkout");
            }, 100);
          }}
          className="w-full py-3 bg-gold-950 hover:bg-gold-800 text-navy-950 
          transition-all duration-500 text-lg font-bold rounded-xl shadow-xl hover:scale-105 active:scale-95 glow-gold"
        >
          🚀 المتابعة للدفع
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
