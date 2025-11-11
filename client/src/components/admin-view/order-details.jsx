import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice.js";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils/imageUtils";
import { 
  Package, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle, 
  Clock, 
  XCircle,
  Truck,
  Edit3,
  Save,
  Image as ImageIcon,
  Eye,
  X,
  Check
} from "lucide-react";

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

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="w-5 h-5 text-gray-400" />;
    
    const normalizedStatus = String(status).toLowerCase().trim();
    
    switch (normalizedStatus) {
      case "confirmed":
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "inprocess":
      case "processing":
        return <Edit3 className="w-5 h-5 text-blue-400" />;
      case "inshipping":
      case "on the way":
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-400" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        // Fallback: show pending icon with the actual status text
        console.warn('Unknown order status:', status);
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">غير محدد</Badge>;
    }
    
    const normalizedStatus = String(status).toLowerCase().trim();
    
    switch (normalizedStatus) {
      case "confirmed":
      case "accepted":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">مقبول</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">مرفوض</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">في الانتظار</Badge>;
      case "inprocess":
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">قيد المعالجة</Badge>;
      case "inshipping":
      case "on the way":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">في الطريق</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">تم الشحن</Badge>;
      case "delivered":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">تم التسليم</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">ملغي</Badge>;
      default:
        // Show the actual status if unknown
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status || 'غير محدد'}</Badge>;
    }
  };

  return (
    <DialogContent className="lg:rounded-[20px] sm:max-w-[900px] bg-[#0B0F19]/95 backdrop-blur-2xl border border-gold-500/30 shadow-[0_0_25px_rgba(210,176,101,0.15)] p-0 text-white overflow-hidden">
      <div className="max-h-[90vh] overflow-y-auto custom-scroll">
        {/* Header */}
        <div className="luxury-gradient p-6 border-b border-gold-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gold-950/20">
                <Package className="w-6 h-6 text-gold-950" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white glow-text">
                  تفاصيل الطلب #{orderDetails?._id?.slice(-8)}
                </h2>
                <p className="text-gold-300">معلومات مفصلة عن الطلب</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(() => {
                const status = orderDetails?.orderStatus || 'pending';
                // Debug: log status for troubleshooting
                if (!orderDetails?.orderStatus) {
                  console.warn('Order status is missing:', orderDetails);
                }
                return (
                  <>
                    {getStatusIcon(status)}
                    {getStatusBadge(status)}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="perfume-card p-4">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold-950/20">
                    <Calendar className="w-5 h-5 text-gold-950" />
                  </div>
                  <div>
                    <p className="text-gold-300 text-sm">تاريخ الطلب</p>
                    <p className="text-white font-semibold">
                      {orderDetails?.createdAt 
                        ? new Date(orderDetails.createdAt).toLocaleDateString('ar-EG')
                        : orderDetails?.orderDate?.split("T")[0] || "غير محدد"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="perfume-card p-4">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gold-300 text-sm">المبلغ الإجمالي</p>
                    <p className="text-white font-semibold">
                      {orderDetails?.total || orderDetails?.totalAfterDiscount || orderDetails?.totalAmount || 0} QR
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="perfume-card p-4">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gold-300 text-sm">طريقة الدفع</p>
                    <p className="text-white font-semibold">
                      {orderDetails?.payment?.method || orderDetails?.paymentMethod || "غير محدد"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="perfume-card p-4">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Package className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gold-300 text-sm">عدد المنتجات</p>
                    <p className="text-white font-semibold">
                      {orderDetails?.items?.length || orderDetails?.cartItems?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="perfume-card">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-gold-950" />
                منتجات الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {(orderDetails?.items?.length > 0 || orderDetails?.cartItems?.length > 0) ? (
                <div className="space-y-4">
                  {(orderDetails.items || orderDetails.cartItems || []).map((item, i) => {
                    // Try multiple image sources
                    const productImageSrc = item.productImage || item.image || (item.productId && typeof item.productId === 'object' ? item.productId.image : '') || '';
                    const imageUrl = productImageSrc ? getImageUrl(productImageSrc) : null;
                    const placeholderUrl = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=80&h=80&fit=crop&crop=center";
                    
                    return (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg border border-gold-500/30 overflow-hidden bg-navy-950/50 flex items-center justify-center flex-shrink-0">
                            {imageUrl ? (
                              <img 
                                src={imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Failed to load product image:', imageUrl, 'Item:', item);
                                  e.target.src = placeholderUrl;
                                }}
                              />
                            ) : (
                              <Package className="w-8 h-8 text-gold-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{item.title}</h4>
                            <p className="text-gold-300 text-sm">الكمية: {item.quantity}</p>
                            {!imageUrl && (
                              <p className="text-red-400 text-xs mt-1">⚠️ لا توجد صورة</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{item.price} QR</p>
                          <p className="text-gold-300 text-sm">المجموع: {(item.price * item.quantity).toFixed(2)} QR</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gold-300 text-center py-8">لا توجد منتجات في هذا الطلب</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className="perfume-card">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-950" />
                معلومات الشحن
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gold-500" />
                    <div>
                      <p className="text-gold-300 text-sm">الاسم</p>
                      <p className="text-white font-semibold">{user?.userName || "غير محدد"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold-500" />
                    <div>
                      <p className="text-gold-300 text-sm">رقم الهاتف</p>
                      <p className="text-white font-semibold">
                        {orderDetails?.address?.phone || orderDetails?.addressInfo?.phone || "غير محدد"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold-500 mt-1" />
                    <div>
                      <p className="text-gold-300 text-sm">العنوان</p>
                      <p className="text-white font-semibold">
                        {orderDetails?.address?.address || orderDetails?.addressInfo?.address || "غير محدد"}
                      </p>
                      <p className="text-gold-300 text-sm">
                        {orderDetails?.address?.city || orderDetails?.addressInfo?.city || ""} - 
                        {orderDetails?.address?.pincode || orderDetails?.addressInfo?.pincode || ""}
                      </p>
                    </div>
                  </div>
                  
                  {(orderDetails?.address?.notes || orderDetails?.addressInfo?.notes) && (
                    <div className="flex items-start gap-3">
                      <Edit3 className="w-5 h-5 text-gold-500 mt-1" />
                      <div>
                        <p className="text-gold-300 text-sm">ملاحظات</p>
                        <p className="text-white font-semibold">
                          {orderDetails?.address?.notes || orderDetails?.addressInfo?.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Proof / Transfer Image */}
          {orderDetails?.payment?.method === 'Transfer' && orderDetails?.payment?.transferInfo && (
            <Card className="perfume-card">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gold-950" />
                  صورة التحويل البنكي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gold-300 text-sm mb-1">اسم المرسل</p>
                      <p className="text-white font-semibold">
                        {orderDetails.payment.transferInfo.fullName || "غير محدد"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gold-300 text-sm mb-1">المبلغ المحوّل</p>
                      <p className="text-white font-semibold">
                        {orderDetails.payment.transferInfo.amountTransferred || 0} QR
                      </p>
                    </div>
                  </div>
                  
                  {orderDetails.payment.transferInfo.image?.url && (
                    <div className="mt-4">
                      <p className="text-gold-300 text-sm mb-3">صورة إثبات التحويل</p>
                      <div className="relative inline-block max-w-full">
                        <img 
                          src={getImageUrl(orderDetails.payment.transferInfo.image.url)}
                          alt="Transfer proof"
                          className="max-w-full h-auto max-h-96 rounded-lg border-2 border-gold-500/30 cursor-pointer hover:border-gold-500 transition object-contain bg-navy-950/30"
                          onClick={() => {
                            const imgUrl = getImageUrl(orderDetails.payment.transferInfo.image.url);
                            window.open(imgUrl, '_blank');
                          }}
                          onError={(e) => {
                            console.error('Failed to load transfer image:', orderDetails.payment.transferInfo.image.url);
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'text-red-400 text-sm mt-2 p-4 bg-red-500/10 rounded-lg border border-red-500/30';
                            errorDiv.innerHTML = `
                              <p>❌ فشل تحميل الصورة</p>
                              <p class="text-xs mt-1">URL: ${orderDetails.payment.transferInfo.image.url}</p>
                              <a href="${getImageUrl(orderDetails.payment.transferInfo.image.url)}" target="_blank" class="text-blue-400 underline text-xs mt-2 block">
                                حاول فتح الصورة في تبويب جديد
                              </a>
                            `;
                            e.target.parentElement.appendChild(errorDiv);
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {orderDetails.payment.status === 'awaiting_admin_approval' && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={async () => {
                          const res = await dispatch(updateOrderStatus({ 
                            id: orderDetails._id, 
                            orderStatus: 'accepted' 
                          }));
                          if (res?.payload?.success) {
                            dispatch(getOrderDetailsForAdmin(orderDetails._id));
                            dispatch(getAllOrdersForAdmin());
                            toast({ title: "✅ تم قبول الطلب بنجاح" });
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        قبول الطلب
                      </Button>
                      <Button
                        onClick={async () => {
                          const res = await dispatch(updateOrderStatus({ 
                            id: orderDetails._id, 
                            orderStatus: 'rejected' 
                          }));
                          if (res?.payload?.success) {
                            dispatch(getOrderDetailsForAdmin(orderDetails._id));
                            dispatch(getAllOrdersForAdmin());
                            toast({ title: "❌ تم رفض الطلب" });
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        رفض الطلب
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Update Status Form */}
          <Card className="perfume-card">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-gold-950" />
                تحديث حالة الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdateStatus} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-3">حالة الطلب الحالية</label>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                      {getStatusIcon(orderDetails?.orderStatus || 'pending')}
                      {getStatusBadge(orderDetails?.orderStatus || 'pending')}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-3">تحديث الحالة</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-navy-950/50 border border-white/20 text-white focus:border-gold-500 focus:outline-none"
                    >
                      <option value="">اختر الحالة الجديدة</option>
                      <option value="pending">في الانتظار</option>
                      <option value="accepted">مقبول</option>
                      <option value="rejected">مرفوض</option>
                      <option value="on the way">في الطريق</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التسليم</option>
                    </select>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={!formData.status}
                  className="w-full bg-gold-950 hover:bg-gold-800 text-navy-950 font-semibold flex items-center justify-center gap-2 glow-gold py-3"
                >
                  <Save className="w-5 h-5" />
                  تحديث حالة الطلب
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
