import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-slate-900 via-black to-slate-800 rounded-[300px] border border-slate-700 p-6 shadow-lg text-white">
      <div className="grid gap-6">
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold border-b pb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order Date</span>
              <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order Price</span>
              <Label>${orderDetails?.totalAmount}</Label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment Status</span>
              <Label>{orderDetails?.paymentStatus}</Label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order Status</span>
              <Badge
                className={`py-1 px-3 text-white ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-600"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-gray-700"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-600" />

        <div className="grid gap-4">
          <h3 className="text-xl font-semibold border-b pb-2">Order Items</h3>
          <ul className="grid gap-3 text-sm">
            {orderDetails?.cartItems?.length > 0 &&
              orderDetails.cartItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md"
                >
                  <span>Title: {item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))}
          </ul>
        </div>

        <Separator className="bg-slate-600" />

        <div className="grid gap-4">
          <h3 className="text-xl font-semibold border-b pb-2">Shipping Info</h3>
          <div className="text-sm text-slate-300 space-y-1">
            <div>Name: {user?.userName}</div>
            <div>Address: {orderDetails?.addressInfo?.address}</div>
            <div>City: {orderDetails?.addressInfo?.city}</div>
            <div>Postal Code: {orderDetails?.addressInfo?.pincode}</div>
            <div>Phone: {orderDetails?.addressInfo?.phone}</div>
            <div>Notes: {orderDetails?.addressInfo?.notes}</div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
