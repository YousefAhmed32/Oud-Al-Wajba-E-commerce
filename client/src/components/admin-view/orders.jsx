import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice.js";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    setSelectedOrderId(getId);
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <>
      <Card className="bg-black border border-white/10 backdrop-blur-md shadow-[0_0_5px_green] text-white rounded-2xl">
        <CardHeader className="pb-4 border-b border-white/10">
          <CardTitle className="text-purple-400 text-2xl font-semibold tracking-wide">
            Order History
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <Table className="text-white">
            <TableHeader>
              <TableRow className="border-b border-white/10 bg-white/5">
                <TableHead className="text-white/70 text-sm">Order ID</TableHead>
                <TableHead className="text-white/70 text-sm">Order Date</TableHead>
                <TableHead className="text-white/70 text-sm">Status</TableHead>
                <TableHead className="text-white/70 text-sm">Price</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow
                    key={orderItem?._id}
                    className="border-b border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <TableCell className="font-mono text-xs">
                      {orderItem?._id}
                    </TableCell>
                    <TableCell className="text-sm">
                      {orderItem?.orderDate.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`px-3 py-1 text-sm rounded-full font-medium shadow ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500/20 text-green-400 border border-green-500/40"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
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
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-4 py-1.5 text-sm rounded-lg shadow-md transition-all"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-white/50">
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
        {orderDetails && <AdminOrderDetailsView orderDetails={orderDetails} />}
      </Dialog>
    </>
  );
}

export default AdminOrdersView;
