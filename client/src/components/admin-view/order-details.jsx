import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import CommonForm from "../common/form";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice.js";
import { useToast } from "@/hooks/use-toast";

const initialFormData = { status: "" };

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleUpdateStatus(e) {
    e.preventDefault();
    if (!formData.status) {
      toast({ title: "Please select a status", variant: "destructive" });
      return;
    }

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: formData.status })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({ title: "✅ Order status updated successfully" });
      }
    });
  }

  return (
 <DialogContent className="lg:rounded-[20px] sm:max-w-[720px] bg-[#0B0F19]/95 backdrop-blur-2xl border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)] p-6 text-white">
  <div className="space-y-6 max-h-[80vh] overflow-y-auto custom-scroll">
        {/* ✅ Order Summary */}
        <div>
          <h3 className="text-xl font-semibold border-b border-white/10 pb-2 mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { label: "Order ID", value: orderDetails?._id },
              { label: "Order Date", value: orderDetails?.orderDate?.split("T")[0] },
              { label: "Order Price", value: `$${orderDetails?.totalAmount}` },
              { label: "Payment Method", value: orderDetails?.paymentMethod },
              { label: "Payment Status", value: orderDetails?.paymentStatus },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-gray-300"
              >
                <span>{item.label}</span>
                <Label>{item.value || "--"}</Label>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Order Status</span>
              <Badge
                className={`px-3 py-1 font-medium ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-600"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-gray-700"
                }`}
              >
                {orderDetails?.orderStatus || "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-600" />

        {/* ✅ Items */}
        <div>
          <h3 className="text-xl font-semibold border-b border-white/10 pb-2 mb-4">
            Order Items
          </h3>
          <ul className="space-y-2 text-sm">
            {orderDetails?.cartItems?.length > 0 ? (
              orderDetails.cartItems.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg"
                >
                  <span>{item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>${item.price}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No items found.</p>
            )}
          </ul>
        </div>

        <Separator className="bg-slate-600" />

        {/* ✅ Shipping Info */}
        <div>
          <h3 className="text-xl font-semibold border-b border-white/10 pb-2 mb-4">
            Shipping Info
          </h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Name: {user?.userName || "N/A"}</p>
            <p>Address: {orderDetails?.addressInfo?.address || "N/A"}</p>
            <p>City: {orderDetails?.addressInfo?.city || "N/A"}</p>
            <p>Postal Code: {orderDetails?.addressInfo?.pincode || "N/A"}</p>
            <p>Phone: {orderDetails?.addressInfo?.phone || "N/A"}</p>
            <p>Notes: {orderDetails?.addressInfo?.notes || "—"}</p>
          </div>
        </div>

        <Separator className="bg-slate-600" />

        {/* ✅ Update Status Form */}
        <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
               labelClassName: "text-white", 
               
              options: [
                { id: "pending", label: "Pending" },
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "delivered", label: "Delivered" },
                { id: "rejected", label: "Rejected" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText="Update Order Status"
          onSubmit={handleUpdateStatus}
        />
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
