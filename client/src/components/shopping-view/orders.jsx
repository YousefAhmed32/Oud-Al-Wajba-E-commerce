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
      <Card className="bg-gray-800/60 border border-white/10 backdrop-blur-md shadow-[0_0_20px_#7f5af0aa] text-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-purple-400 tracking-wider text-2xl">Order History</CardTitle>
        </CardHeader>

        <CardContent>
          <Table className="text-white">
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-white/70">Order ID</TableHead>
                <TableHead className="text-white/70">Order Date</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
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
                    <TableCell className="font-mono text-sm">{orderItem?._id}</TableCell>
                    <TableCell className="text-sm">
                      {orderItem?.orderDate.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 text-sm rounded-xl font-medium shadow-md
                          ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/50"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-500/20 text-red-400 border border-red-500/50"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                          }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-green-300">
                      ${orderItem?.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-4 py-2 text-sm rounded-xl shadow-md transition-all"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-white/60">
                    No orders found.
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
