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
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice.js";
import { Badge } from "../ui/badge";
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Package, 
  Eye, 
  MoreVertical,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3,
  Truck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

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

  const filteredOrders = orderList?.filter(order => {
    const orderDate = order.createdAt || order.orderDate;
    const matchesSearch = order._id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.payment?.method?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.orderStatus === filterStatus;
    const matchesDate = filterDate === "all" || 
                       (filterDate === "today" && orderDate && new Date(orderDate).toDateString() === new Date().toDateString()) ||
                       (filterDate === "week" && orderDate && new Date(orderDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (filterDate === "month" && orderDate && new Date(orderDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="w-4 h-4 text-muted-foreground" />;
    
    const normalizedStatus = String(status).toLowerCase().trim();
    
    switch (normalizedStatus) {
      case "confirmed":
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case "processing":
        return <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "on the way":
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return <Badge className="bg-muted text-muted-foreground border-border">غير محدد</Badge>;
    }
    
    const normalizedStatus = String(status).toLowerCase().trim();
    
    switch (normalizedStatus) {
      case "confirmed":
      case "accepted":
        return <Badge className="bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">مقبول</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30">مرفوض</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">في الانتظار</Badge>;
      case "processing":
        return <Badge className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">قيد المعالجة</Badge>;
      case "on the way":
        return <Badge className="bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">في الطريق</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">تم الشحن</Badge>;
      case "delivered":
        return <Badge className="bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">تم التسليم</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30">ملغي</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-border">{status || 'غير محدد'}</Badge>;
    }
  };

  const totalRevenue = orderList?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const confirmedOrders = orderList?.filter(order => order.orderStatus === "confirmed").length || 0;
  const pendingOrders = orderList?.filter(order => order.orderStatus === "pending").length || 0;

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 backdrop-blur-sm">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              إدارة الطلبات
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            إدارة وتتبع جميع طلبات العملاء
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-right">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{orderList?.length || 0}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">إجمالي الطلبات</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-xl bg-green-500/10 dark:bg-green-500/20">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-right">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{confirmedOrders}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">طلبات مؤكدة</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-xl bg-yellow-500/10 dark:bg-yellow-500/20">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-right">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{pendingOrders}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">في الانتظار</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-500/10 dark:bg-purple-500/20">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-right">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">${totalRevenue.toFixed(2)}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">إجمالي الإيرادات</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            فلاتر البحث
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm sm:text-base min-w-[140px]"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="accepted">مقبول</option>
              <option value="rejected">مرفوض</option>
              <option value="processing">قيد المعالجة</option>
              <option value="on the way">في الطريق</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم التسليم</option>
              <option value="cancelled">ملغي</option>
            </select>

            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 sm:px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm sm:text-base min-w-[140px]"
            >
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((orderItem) => (
              <div key={orderItem._id} className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1 w-full lg:w-auto">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 dark:bg-primary/20 flex-shrink-0">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="text-foreground font-semibold text-base sm:text-lg">
                          طلب #{orderItem._id.slice(-8)}
                        </h3>
                        {getStatusIcon(orderItem.orderStatus || 'pending')}
                        {getStatusBadge(orderItem.orderStatus || 'pending')}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{orderItem.createdAt ? new Date(orderItem.createdAt).toLocaleDateString('ar-EG') : 
                                 orderItem.orderDate ? orderItem.orderDate.split("T")[0] : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {orderItem.total || orderItem.totalAfterDiscount || orderItem.totalAmount || 0} QR
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{orderItem.items?.length || orderItem.cartItems?.length || 0} منتج</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary">طريقة الدفع: {orderItem.payment?.method || 'N/A'}</span>
                        </div>
                        {orderItem.payment?.method === 'Transfer' && orderItem.payment?.transferInfo && (
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <span className="truncate">تحويل: {orderItem.payment.transferInfo.fullName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end">
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem._id)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">عرض التفاصيل</span>
                      <span className="sm:hidden">عرض</span>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
                          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem className="text-foreground hover:bg-green-500/10 dark:hover:bg-green-500/20">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          تأكيد الطلب
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-yellow-500/10 dark:hover:bg-yellow-500/20">
                          <Clock className="w-4 h-4 mr-2" />
                          وضع في الانتظار
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-red-500/10 dark:hover:bg-red-500/20">
                          <XCircle className="w-4 h-4 mr-2" />
                          رفض الطلب
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground text-base sm:text-lg font-semibold mb-2">لا توجد طلبات</p>
              <p className="text-muted-foreground text-sm">لم يتم العثور على طلبات تطابق الفلاتر المحددة</p>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}

export default AdminOrdersView;
