import ProductImageUpload from "@/components/admin-view/image-uploud";
import MultipleImageUpload from "@/components/admin-view/multiple-image-upload";
import AdminProductTitle from "@/components/admin-view/product-title";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProduct,
} from "@/store/admin/product-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, Pencil, Image as ImageIcon, Package, Trash2, CheckCircle, AlertTriangle, Tags, X } from "lucide-react";

const initialFormData = {
  image: null,
  images: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  size: "",
  fragranceType: "",
  gender: "",
};

function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingStatus, setImageLoadingState] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    // تحضير الصور للرفع
    const images = productImages.map(img => img.url);
    const mainImage = images[mainImageIndex] || uploadedImageUrl;

    if (currentEditId) {
      dispatch(
        editProduct({
          id: currentEditId,
          formData: {
            ...formData,
            image: mainImage,
            images: images,
          },
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProduct());
          resetForm();
          toast({ title: "✅ تم تحديث المنتج بنجاح" });
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          image: mainImage,
          images: images,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProduct());
          resetForm();
          toast({ title: "✅ تم إضافة المنتج بنجاح" });
        }
      });
    }
  }

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProduct());
        toast({ title: "🗑️ Product deleted successfully" });
      }
    });
  }

  function resetForm() {
    setFormData(initialFormData);
    setOpenCreateProductDialog(false);
    setCurrentEditId(null);
    setImageFile(null);
    setUploadedImageUrl("");
    setProductImages([]);
    setMainImageIndex(0);
  }

  function isFormValid() {
    const requiredFields = ['title', 'description', 'category', 'brand', 'price', 'totalStock', 'gender'];
    const hasImages = productImages.length > 0 || uploadedImageUrl;
    return requiredFields.every(field => formData[field] && formData[field] !== "") && 
           hasImages && 
           parseFloat(formData.price) > 0 && 
           parseInt(formData.totalStock) >= 0;
  }

  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);

  // منع إعادة التوجيه عند إعادة التحميل
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // لا نفعل شيء - نترك المستخدم في نفس الصفحة
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen luxury-gradient p-6">
      <div className="max-w-8xl mx-auto space-y-12">
        {/* Enhanced Header */}
        <div className="text-center relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-luxury-gold/3 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/10 backdrop-blur-sm border border-luxury-gold/30 shadow-[0_0_30px_rgba(210,176,101,0.3)]">
                <Package className="w-12 h-12 text-luxury-gold" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white glow-text mb-2">
                  إدارة المنتجات
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-luxury-gold to-luxury-gold-light mx-auto rounded-full" />
              </div>
            </div>
            <p className="text-luxury-gold text-xl max-w-3xl mx-auto leading-relaxed">
              إدارة شاملة لمخزون المنتجات وإضافة منتجات جديدة بسهخة
            </p>
          </div>
        </div>

        {/* Add New Product Button */}
        <div className="text-center">
          <Button
            onClick={() => setOpenCreateProductDialog(true)}
            className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-light hover:to-luxury-gold text-luxury-navy font-bold flex items-center gap-3 glow-gold py-4 text-xl rounded-xl shadow-[0_0_20px_rgba(210,176,101,0.4)] transition-all duration-300 hover:scale-105"
          >
            <PlusCircle size={24} /> إضافة منتج جديد
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Products */}
          <Card className="bg-luxury-navy/20 backdrop-blur-sm border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(210,176,101,0.2)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-luxury-gold/70 text-sm font-medium">إجمالي المنتجات</p>
                  <p className="text-3xl font-bold text-white mt-2">{productList?.length || 0}</p>
                  <p className="text-green-400 text-xs mt-1">+12% من الشهر الماضي</p>
                </div>
                <div className="p-3 rounded-xl bg-luxury-gold/20">
                  <Package className="w-8 h-8 text-luxury-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Products */}
          <Card className="bg-luxury-navy/20 backdrop-blur-sm border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(210,176,101,0.2)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-luxury-gold/70 text-sm font-medium">المنتجات النشطة</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {productList?.filter(p => p.totalStock > 0).length || 0}
                  </p>
                  <p className="text-green-400 text-xs mt-1">متوفرة للبيع</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/20">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Out of Stock */}
          <Card className="bg-luxury-navy/20 backdrop-blur-sm border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(210,176,101,0.2)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-luxury-gold/70 text-sm font-medium">نفذ المخزون</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {productList?.filter(p => p.totalStock === 0).length || 0}
                  </p>
                  <p className="text-red-400 text-xs mt-1">يحتاج إعادة تموين</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="bg-luxury-navy/20 backdrop-blur-sm border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(210,176,101,0.2)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-luxury-gold/70 text-sm font-medium">الفئات المختلفة</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {new Set(productList?.map(p => p.category)).size || 0}
                  </p>
                  <p className="text-blue-400 text-xs mt-1">فئات متنوعة</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Tags className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Product Grid */}
        <div className="space-y-8">
          {/* Grid Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-luxury-gold/20">
                <Package className="w-8 h-8 text-luxury-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">منتجات المتجر</h3>
                <p className="text-luxury-gold/70">إدارة شاملة لجميع منتجاتك</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-luxury-navy/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-luxury-gold/20">
                <span className="text-luxury-gold font-semibold">
                  إجمالي المنتجات: {productList?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {productList?.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {productList.map((productItem, index) => (
                <div
                  key={productItem._id}
                  className="group relative bg-luxury-navy/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(210,176,101,0.3)]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={productItem.image}
                      alt={productItem.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {productItem.salePrice && productItem.salePrice < productItem.price && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          خصم
                        </span>
                      )}
                      {productItem.totalStock === 0 && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          نفذ المخزون
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...productItem,
                            image: productItem.image
                          });
                          setCurrentEditId(productItem._id);
                          setOpenCreateProductDialog(true);
                        }}
                        className="bg-luxury-gold/95 border-luxury-gold text-luxury-navy hover:bg-luxury-gold-light hover:text-luxury-navy shadow-[0_0_15px_rgba(210,176,101,0.6)] backdrop-blur-sm"
                        title="تعديل المنتج"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(productItem._id)}
                        className="bg-red-500/95 border-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)] backdrop-blur-sm"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    {/* Title and Brand */}
                    <div>
                      <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-luxury-gold transition-colors duration-300">
                        {productItem.title}
                      </h3>
                      <p className="text-luxury-gold/70 text-sm">{productItem.brand}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {productItem.salePrice && productItem.salePrice < productItem.price ? (
                          <>
                            <span className="text-xl font-bold text-luxury-gold">
                              ${productItem.salePrice}
                            </span>
                            <span className="text-white/50 line-through text-sm">
                              ${productItem.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-luxury-gold">
                            ${productItem.price}
                          </span>
                        )}
                      </div>
                      
                      {/* Stock Status */}
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          productItem.totalStock > 0 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {productItem.totalStock > 0 ? `${productItem.totalStock} متوفر` : 'نفذ المخزون'}
                        </span>
                      </div>
                    </div>

                    {/* Category and Gender */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">الفئة: {productItem.category}</span>
                      <span className="text-white/70">الجنس: {productItem.gender}</span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...productItem,
                            image: productItem.image
                          });
                          setCurrentEditId(productItem._id);
                          setOpenCreateProductDialog(true);
                        }}
                        className="flex-1 bg-luxury-gold/20 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-navy text-xs"
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(productItem._id)}
                        className="bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-xs"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-luxury-gold/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">لا توجد منتجات</h3>
                <p className="text-luxury-gold/70 mb-8">ابدأ بإضافة منتج جديد لبناء متجرك</p>
                <Button
                  onClick={() => setOpenCreateProductDialog(true)}
                  className="bg-luxury-gold text-luxury-navy hover:bg-luxury-gold-light font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(210,176,101,0.4)]"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  إضافة أول منتج
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Modal Overlay */}
        {openCreateProductDialog && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
            {/* Enhanced Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
              onClick={() => resetForm()}
            />
            
            {/* Enhanced Modal Content */}
            <div className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden luxury-gradient text-white rounded-2xl sm:rounded-3xl border border-luxury-gold/30 shadow-[0_0_60px_rgba(210,176,101,0.3)] transform transition-all duration-300 scale-100 mx-2 sm:mx-4 lg:mx-6">
              {/* Modal Header - Fixed */}
              <div className="sticky top-0 z-10 bg-luxury-navy/95 backdrop-blur-sm border-b border-luxury-gold/20 pb-4 sm:pb-6 mb-0 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-6">
                    {currentEditId !== null ? (
                      <>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10 border border-luxury-gold/30 shadow-[0_0_20px_rgba(210,176,101,0.3)]">
                          <Pencil className="w-10 h-10 text-luxury-gold" />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white glow-text mb-2">تعديل المنتج</h2>
                          <p className="text-luxury-gold/70 text-sm sm:text-base lg:text-lg">قم بتحديث معلومات المنتج</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10 border border-luxury-gold/30 shadow-[0_0_20px_rgba(210,176,101,0.3)]">
                          <PlusCircle className="w-10 h-10 text-luxury-gold" />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white glow-text mb-2">إضافة منتج جديد</h2>
                          <p className="text-luxury-gold/70 text-sm sm:text-base lg:text-lg">أضف منتج جديد إلى المتجر</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Close Button */}
                  <Button
                    onClick={() => resetForm()}
                    variant="outline"
                    size="icon"
                    className="bg-luxury-navy/50 border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-navy shadow-[0_0_15px_rgba(210,176,101,0.3)]"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(95vh-120px)] scrollbar-thin scrollbar-thumb-luxury-gold/50 scrollbar-track-luxury-navy/20 hover:scrollbar-thumb-luxury-gold/70">
                {/* Upload Section */}
                <div className="p-2 sm:p-4 lg:p-6">
                  <div className="bg-luxury-navy/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-luxury-gold/20 shadow-[0_0_30px_rgba(210,176,101,0.1)]">
                    <div className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10 border border-luxury-gold/30 shadow-[0_0_20px_rgba(210,176,101,0.3)]">
                        <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-luxury-gold" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">صور المنتج</h3>
                        <p className="text-luxury-gold/70 text-sm sm:text-base lg:text-lg">ارفع صور متعددة للمنتج (صورة رئيسية + صور إضافية)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      {/* Multiple Image Upload */}
                      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <MultipleImageUpload
                          images={productImages}
                          setImages={setProductImages}
                          maxImages={5}
                          mainImageIndex={mainImageIndex}
                          setMainImageIndex={setMainImageIndex}
                        />
                      </div>

                      {/* Single Image Upload Fallback */}
                      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <div className="bg-luxury-navy/30 rounded-2xl p-3 sm:p-4 lg:p-6 border border-luxury-gold/20">
                          <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                            <div className="w-2 h-2 bg-luxury-gold rounded-full shadow-[0_0_10px_rgba(210,176,101,0.5)]"></div>
                            الرفع التقليدي
                          </h4>
                          <p className="text-luxury-gold/70 text-xs sm:text-sm mb-4 sm:mb-6">استخدم هذا الخيار للرفع التقليدي</p>
                          <ProductImageUpload
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            uploadedImageUrl={uploadedImageUrl}
                            setUploadedImageUrl={setUploadedImageUrl}
                            setImageLoadingState={setImageLoadingState}
                            imageLoadingStatus={imageLoadingStatus}
                            isEditMode={currentEditId !== null}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Section */}
                <div className="py-2 sm:py-4 lg:py-6">
                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    {/* Basic Information */}
                    <div className="bg-luxury-navy/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-luxury-gold/20 shadow-[0_0_30px_rgba(210,176,101,0.1)]">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                        <div className="w-4 h-4 bg-luxury-gold rounded-full shadow-[0_0_15px_rgba(210,176,101,0.6)]"></div>
                        المعلومات الأساسية
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                        {addProductFormElements.slice(0, 4).map((control, index) => (
                          <div key={index} className={index === 1 ? "lg:col-span-2" : ""}>
                            <CommonForm
                              formControls={[control]}
                              formData={formData}
                              setFormData={setFormData}
                              labelClassName="text-white font-bold text-sm sm:text-base lg:text-xl"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="bg-luxury-navy/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-luxury-gold/20 shadow-[0_0_30px_rgba(210,176,101,0.1)]">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                        <div className="w-4 h-4 bg-luxury-gold rounded-full shadow-[0_0_15px_rgba(210,176,101,0.6)]"></div>
                        التسعير والمخزون
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {addProductFormElements.slice(4, 7).map((control, index) => (
                          <div key={index}>
                            <CommonForm
                              formControls={[control]}
                              formData={formData}
                              setFormData={setFormData}
                              labelClassName="text-white font-bold text-sm sm:text-base lg:text-xl"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-luxury-navy/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-luxury-gold/20 shadow-[0_0_30px_rgba(210,176,101,0.1)]">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                        <div className="w-4 h-4 bg-luxury-gold rounded-full shadow-[0_0_15px_rgba(210,176,101,0.6)]"></div>
                        تفاصيل المنتج
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {addProductFormElements.slice(7).map((control, index) => (
                          <div key={index}>
                            <CommonForm
                              formControls={[control]}
                              formData={formData}
                              setFormData={setFormData}
                              labelClassName="text-white font-bold text-sm sm:text-base lg:text-xl"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 sm:pt-8 lg:pt-10 border-t border-luxury-gold/20">
                      <div className="bg-luxury-navy/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-luxury-gold/20 shadow-[0_0_30px_rgba(210,176,101,0.1)]">
                        <div className="text-center mb-4 sm:mb-6">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">جاهز للحفظ؟</h3>
                          <p className="text-luxury-gold/70 text-sm sm:text-base">تأكد من صحة جميع البيانات قبل الحفظ</p>
                        </div>
                        
                        <Button
                          type="submit"
                          onClick={onSubmit}
                          disabled={!isFormValid()}
                          className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-light hover:to-luxury-gold text-luxury-navy font-bold flex items-center justify-center gap-2 sm:gap-4 glow-gold py-4 sm:py-6 text-lg sm:text-xl lg:text-2xl rounded-2xl shadow-[0_0_30px_rgba(210,176,101,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {currentEditId ? (
                            <>
                              <Pencil className="w-6 h-6 sm:w-8 sm:h-8" />
                              تحديث المنتج
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                              إضافة المنتج
                            </>
                          )}
                        </Button>
                        
                        {!isFormValid() && (
                          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-red-500/20 border border-red-500/30 rounded-2xl">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs sm:text-sm font-bold">!</span>
                              </div>
                              <h4 className="text-red-400 font-bold text-sm sm:text-base lg:text-lg">تحقق من البيانات</h4>
                            </div>
                            <p className="text-red-400 text-center font-medium text-xs sm:text-sm">
                              يرجى ملء جميع الحقول المطلوبة وتحميل صورة المنتج
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
