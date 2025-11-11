import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { Dialog } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrderByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice.js";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    setSelectedOrderId(getId);
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrderByUserId(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <>
      <Card className="perfume-card backdrop-blur-md shadow-[0_0_20px_rgba(210,176,101,0.3)] text-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-gold-950 tracking-wider text-2xl glow-text">سجل الطلبات</CardTitle>
        </CardHeader>

        <CardContent>
          <Table className="text-white">
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-white/70">رقم الطلب</TableHead>
                <TableHead className="text-white/70">التاريخ</TableHead>
                <TableHead className="text-white/70">الحالة</TableHead>
                <TableHead className="text-white/70">طريقة الدفع</TableHead>
                <TableHead className="text-white/70">المبلغ</TableHead>
                <TableHead>
                  <span className="sr-only">التفاصيل</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow
                    key={orderItem?._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-mono text-sm">{orderItem?._id?.toString().substring(0, 8)}...</TableCell>
                    <TableCell className="text-sm">
                      {orderItem?.createdAt ? new Date(orderItem.createdAt).toLocaleDateString('ar-EG') : 
                       orderItem?.orderDate ? orderItem.orderDate.split("T")[0] : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const status = orderItem?.orderStatus || 'pending';
                        const normalizedStatus = String(status).toLowerCase().trim();
                        
                        let badgeClass = "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
                        let badgeText = status;
                        
                        if (normalizedStatus === "accepted" || normalizedStatus === "confirmed" || normalizedStatus === "delivered") {
                          badgeClass = "bg-green-500/20 text-green-400 border border-green-500/50";
                          badgeText = normalizedStatus === "accepted" || normalizedStatus === "confirmed" ? "مقبول" : "تم التسليم";
                        } else if (normalizedStatus === "rejected") {
                          badgeClass = "bg-red-500/20 text-red-400 border border-red-500/50";
                          badgeText = "مرفوض";
                        } else if (normalizedStatus === "on the way" || normalizedStatus === "shipped") {
                          badgeClass = "bg-blue-500/20 text-blue-400 border border-blue-500/50";
                          badgeText = normalizedStatus === "on the way" ? "في الطريق" : "تم الشحن";
                        } else if (normalizedStatus === "processing") {
                          badgeClass = "bg-purple-500/20 text-purple-400 border border-purple-500/50";
                          badgeText = "قيد المعالجة";
                        } else if (normalizedStatus === "cancelled") {
                          badgeClass = "bg-red-500/20 text-red-400 border border-red-500/50";
                          badgeText = "ملغي";
                        } else {
                          badgeText = "في الانتظار";
                        }
                        
                        return (
                          <Badge className={`py-1 px-3 text-sm rounded-xl font-medium shadow-md ${badgeClass}`}>
                            {badgeText}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-sm text-white/70">
                      {orderItem?.payment?.method || orderItem?.paymentMethod || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-green-300">
                      {orderItem?.total || orderItem?.totalAfterDiscount || orderItem?.totalAmount || 0} QR
                      {orderItem?.appliedCoupon?.discountAmount > 0 && (
                        <span className="text-xs text-gold-300 block">خصم: {orderItem.appliedCoupon.discountAmount} QR</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="bg-gold-950 hover:bg-gold-800 text-navy-950 px-4 py-2 text-sm rounded-xl shadow-md transition-all glow-gold"
                      >
                        عرض التفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-white/60">
                    لا توجد طلبات.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={openDetailsDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDetailsDialog(false);
            dispatch(resetOrderDetails());
            setSelectedOrderId(null);
          }
        }}
      >
        {orderDetails && (
          <ShoppingOrderDetailsView orderDetails={orderDetails} />
        )}
      </Dialog>
    </>
  );
}

export default ShoppingOrders;
