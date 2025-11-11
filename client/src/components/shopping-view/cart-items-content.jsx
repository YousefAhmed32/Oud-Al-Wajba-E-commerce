import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils/imageUtils";

const UserCartItemsContent = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);


  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];
      if (getCartItems.length) {

        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );
        const getCurrentProductIndex = productList.findIndex(product=>product._id === getCartItem.productId) 
        const getTotalStock = productList[getCurrentProductIndex].totalStock
        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `يمكن إضافة ${getQuantity} كمية فقط لهذا المنتج`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data.payload.success) {
        toast({
          title: "تم تحديث عنصر السلة بنجاح",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data.payload.success) {
        toast({
          title: "تم حذف عنصر السلة بنجاح",
        });
      }
    });
  }
  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg bg-navy-950/30 border elegant-border">
      <img
        src={getImageUrl(cartItem.image)}
        alt={cartItem.title}
        className="w-20 h-20 rounded object-cover"
        onError={(e) => {
          e.target.src = '/placeholder-product.jpg';
        }}
      />
      <div className="flex-1">
        <h3 className="font-extrabold text-white">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-navy-950/50 border-elegant-border text-white hover:bg-gold-950/20"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold text-white">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-navy-950/50 border-elegant-border text-white hover:bg-gold-950/20"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold text-gold-950">
          QR
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem.quantity
          ).toFixed(2)} QR
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1 text-red-400 hover:text-red-300 transition-colors"
          size={20}
        />
      </div>
    </div>
  );
};
export default UserCartItemsContent;
