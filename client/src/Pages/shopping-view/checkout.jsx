import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice.js";
import { useToast } from "@/hooks/use-toast";
import { fetchAllCoupons } from "@/store/admin/coupon";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const totalCartAmount = cartItems?.items?.reduce((sum, item) => {
    const price = item?.salePrice > 0 ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0) || 0;
  
  const discountedTotal = totalCartAmount - discountAmount;
  // Simulate coupon validation


  const [couponCode, setCouponCode] = useState("");
  const {couponList} = useSelector(state=>state.adminCoupon)
  console.log("couponList", couponList);

   useEffect(() => {
      dispatch(fetchAllCoupons());
    }, [dispatch]);
 function applyCoupon() {
  const trimmed = couponCode.trim().toUpperCase();
  if (!trimmed) return;

  // Find coupon from Redux list
  const coupon = couponList?.find(c => c.code.toUpperCase() === trimmed);

  if (!coupon) {
    toast({ title: "❌ Invalid coupon code.", variant: "destructive" });
    setDiscountAmount(0);
    return;
  }

  // Check if expired
  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
  if (isExpired || !coupon.isActive || coupon.usedCount >= coupon.usageLimit) {
    toast({ title: "❌ Coupon expired or unavailable.", variant: "destructive" });
    setDiscountAmount(0);
    return;
  }

  // Apply Discount
  if (coupon.discount === "percentage") {
    const discount = totalCartAmount * (coupon.discountValue / 100);
    setDiscountAmount(discount);
    toast({ title: `✅ ${coupon.code} applied: ${coupon.discountValue}% off!` });
  } else if (coupon.discount === "Fixed") {
    setDiscountAmount(coupon.discountValue);
    toast({ title: `✅ ${coupon.code} applied: ${coupon.discountValue} EGP off!` });
  }
}

  function handleInitialPaypal() {
    if (!cartItems?.items?.length) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }

    if (!currentSelectedAddress) {
      toast({ title: "Please select an address", variant: "destructive" });
      return;
    }

    const orderData = {
      userId: user.id,
      cartId: cartItems._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        pincode: currentSelectedAddress.pincode,
        city: currentSelectedAddress.city,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: discountedTotal ,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="w-full h-full object-center object-cover" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        <div className="flex flex-col gap-4">
          {cartItems?.items?.length > 0 &&
            cartItems.items.map((item) => (
              <UserCartItemsContent cartItem={item} key={item.productId} />
            ))}

          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-gray-700">Coupon Code</label>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon (e.g. SAVE10)"
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              <Button onClick={applyCoupon}>Apply</Button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalCartAmount.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount</span>
                <span>- ${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${discountedTotal.toFixed(2)}</span>
            </div>
          </div>

      
          <div className="mt-4">
            <Button onClick={handleInitialPaypal} className="w-full">
              {isPaymentStart ? "Processing..." : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;


// import Address from "@/components/shopping-view/address";
// import img from "../../assets/account.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { createNewOrder } from "@/store/shop/order-slice.js";
// import { useToast } from "@/hooks/use-toast";
// function ShoppingCheckout() {
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { user } = useSelector((state) => state.auth);
//   const [currentSelectedAddress,setCurrentSelectedAddress]=useState(null)
//   const [isPaymentStart,setIsPaymentStart]=useState(false)
//   const {approvalURL}=useSelector(state=>state.shopOrder)
//   const dispatch=useDispatch()
//   const {toast} = useToast()

//   console.log('Youns++', currentSelectedAddress,cartItems)

//    const totalCartAmount =
//     cartItems && cartItems.items && cartItems.items.length > 0
//       ? cartItems.items.reduce(
//           (sum, currentItem) =>
//             sum +
//             (currentItem?.salePrice > 0
//               ? currentItem?.salePrice
//               : currentItem?.price) *
//               currentItem?.quantity,
//           0
//         )
//       : 0;

    

//   function handleInitialPaypal() {

//     if(cartItems.length===0){
//       toast({
//         title:'Your Cart is empty. Please ad items to proceed',
//         variant:'destructive'
//       })
//       return
//     }
//     if(currentSelectedAddress===null){
//       toast({
//         title:'Please select one address to proceed.',
//         variant:'destructive'
//       })
//       return
//     }




//    const orderData={
//      userId : user.id,
//       cartId: cartItems._id,
//        cartItems:  cartItems.items.map(singleCartItem=>({
//          productId:singleCartItem?.productId,
//             title: singleCartItem?.title,
//             image: singleCartItem?.image,
//             price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice :singleCartItem?.price,
//             quantity: singleCartItem?.quantity,
//        })),
//        addressInfo:{
//         addressId:currentSelectedAddress?._id,
//         address: currentSelectedAddress?.address,
//         pincode: currentSelectedAddress?.pincode,
//         city: currentSelectedAddress?.city,
//         phone: currentSelectedAddress?.phone,
//         notes: currentSelectedAddress?.notes,
//        },
//        orderStatus:'pending',
//        paymentMethod:'paypal',
//        paymentStatus:'pending',
//        totalAmount:totalCartAmount,
//        orderDate:new Date(),
//        orderUpdateDate:new Date(),
//        paymentId:'',
//        payerId:'',
//    }
//    console.log('orderData', orderData)

//    dispatch(createNewOrder(orderData)).then((data)=>{
//     console.log('Youns+++', data)
//     if(data.payload?.success){
//       setIsPaymentStart(true)
//     }else{
//       setIsPaymentStart(false)
//     }
    
//    })

//   }

//   if(approvalURL){
//     window.location.href=approvalURL
//   }
  

//   return (
//     <div className="flex flex-col">
//       <div className="relative h-[300] w-full overflow-hidden">
//         <img src={img} className="w-full h-full object-center  object-cover" />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
//         <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
//         <div className="flex flex-col gap-4">
//           {cartItems && cartItems.items && cartItems.items.length > 0
//             ? cartItems.items.map((item) => (
//                 <UserCartItemsContent cartItem={item} />
//               ))
//             : null}

//           <div className="mt-8 space-y-4">
//             <div className="flex justify-between">
//               <span className="font-bold">Total</span>
//               <span className="font-bold">${totalCartAmount}</span>
//             </div>
//           </div>
//           <div className="w-full mt-4">
//             <Button onClick={handleInitialPaypal} className="w-full">
//               {
//                 isPaymentStart ? 'Processing Paypal payment...' : 'Checkout with Paypal'
//               }
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShoppingCheckout;
