import ProductImageUpload from "@/components/admin-view/image-uploud";
import MultipleImageUpload from "@/components/admin-view/multiple-image-upload";
import BrandSelect from "@/components/admin-view/brand-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getProductImageUrl, getImageUrl } from "@/utils/imageUtils";
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

function AdminProductsSimple() {
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

    // Extract File objects from productImages and imageFile
    const imageFiles = [];
    
    // Add files from productImages array (multiple images)
    productImages.forEach(img => {
      if (img.file instanceof File) {
        imageFiles.push(img.file);
      }
    });
    
    // Add single uploaded image file if exists
    if (imageFile instanceof File) {
      imageFiles.push(imageFile);
    }

    // Prepare form data with File objects
    const submitData = {
      ...formData,
      imageFiles: imageFiles.length > 0 ? imageFiles : undefined
    };

    if (currentEditId) {
      dispatch(
        editProduct({
          id: currentEditId,
          formData: submitData,
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
        addNewProduct(submitData)
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
        toast({ title: "🗑️ تم حذف المنتج بنجاح" });
      }
    });
  }

  function resetForm() {
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setProductImages([]);
    setMainImageIndex(0);
    setCurrentEditId(null);
    setOpenCreateProductDialog(false);
  }

  function handleEditProduct(productItem) {
    setCurrentEditId(productItem._id);
    setFormData({
      title: productItem.title || "",
      description: productItem.description || "",
      category: productItem.category || "",
      brand: productItem.brand || "",
      price: productItem.price || "",
      salePrice: productItem.salePrice || "",
      totalStock: productItem.totalStock || "",
      size: productItem.size || "",
      fragranceType: productItem.fragranceType || "",
      gender: productItem.gender || "",
    });
    
    // Handle existing images using utility function
    if (productItem.image) {
      // Handle both string and object formats
      let imageUrl = '';
      if (typeof productItem.image === 'string') {
        imageUrl = getImageUrl(productItem.image);
      } else if (productItem.image.url) {
        imageUrl = getImageUrl(productItem.image.url);
      }
      setUploadedImageUrl(imageUrl);
    }
    
    // Convert image objects/URLs to the format expected by MultipleImageUpload
    if (productItem.images && Array.isArray(productItem.images)) {
      const formattedImages = productItem.images.map(img => {
        let url = '';
        if (typeof img === 'string') {
          // Legacy format: just a URL string
          url = getImageUrl(img);
        } else if (img.url) {
          // New format: image object with metadata
          url = getImageUrl(img.url);
        }
        return url ? { url, id: Date.now() + Math.random() } : null;
      }).filter(Boolean);
      
      setProductImages(formattedImages);
      if (formattedImages.length > 0) {
        setMainImageIndex(0);
      }
    }
    
    setOpenCreateProductDialog(true);
  }

  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);

  const isFormValid = () => {
    return formData.title && 
           formData.description && 
           formData.category && 
           formData.brand && 
           formData.price && 
           formData.totalStock && 
           formData.gender &&
           (uploadedImageUrl || productImages.length > 0);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-primary/10 dark:bg-primary/20">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">إدارة المنتجات</h1>
          </div>
          <p className="text-primary/70 text-lg">إدارة شاملة لجميع منتجات المتجر</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary/70 text-sm">إجمالي المنتجات</p>
                  <p className="text-3xl font-bold text-foreground">{productList?.length || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Package className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary/70 text-sm">منتجات نشطة</p>
                  <p className="text-3xl font-bold text-foreground">
                    {productList?.filter(p => p.isActive !== false).length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/20">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary/70 text-sm">نفذ المخزون</p>
                  <p className="text-3xl font-bold text-foreground">
                    {productList?.filter(p => p.totalStock === 0).length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary/70 text-sm">الفئات المختلفة</p>
                  <p className="text-3xl font-bold text-foreground">
                    {new Set(productList?.map(p => p.category)).size || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Tags className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="text-center">
          <Button
            onClick={() => setOpenCreateProductDialog(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 text-lg rounded-xl shadow-[0_0_20px_rgba(210,176,101,0.4)]"
          >
            <PlusCircle className="w-6 h-6 mr-2" />
            إضافة منتج جديد
          </Button>
        </div>

        {/* Products Grid */}
        {productList?.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productList.map((productItem) => (
              <Card key={productItem._id} className="bg-card border border-border shadow-sm hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted/30 dark:bg-muted/20">
                      <img
                        src={getProductImageUrl(productItem)}
                        alt={productItem.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">{productItem.title}</h3>
                      <p className="text-primary/70 text-sm line-clamp-2">{productItem.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${productItem.price}</span>
                        <span className="text-sm text-foreground/70">المخزون: {productItem.totalStock}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(productItem)}
                        className="flex-1 border-border text-primary hover:bg-luxury-gold hover:text-luxury-navy"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(productItem._id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500 hover:text-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-primary/50" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">لا توجد منتجات</h3>
              <p className="text-primary/70 mb-8">ابدأ بإضافة منتج جديد لبناء متجرك</p>
              <Button
                onClick={() => setOpenCreateProductDialog(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-xl"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                إضافة أول منتج
              </Button>
            </div>
          </div>
        )}

        {/* Simple Product Form Modal */}
        {openCreateProductDialog && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-background/95 backdrop-blur-sm text-foreground rounded-2xl border border-border shadow-[0_0_60px_rgba(210,176,101,0.3)]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
                    <PlusCircle className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {currentEditId ? "تعديل المنتج" : "إضافة منتج جديد"}
                    </h2>
                    <p className="text-primary/70">املأ البيانات المطلوبة</p>
                  </div>
                </div>
                <Button
                  onClick={() => resetForm()}
                  variant="outline"
                  size="icon"
                  className="border-border text-primary hover:bg-luxury-gold hover:text-luxury-navy"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form Content */}
              <form onSubmit={onSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Images Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    صور المنتج
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Multiple Images */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">صور متعددة (اختياري)</label>
                      <MultipleImageUpload
                        images={productImages}
                        setImages={setProductImages}
                        maxImages={5}
                        mainImageIndex={mainImageIndex}
                        setMainImageIndex={setMainImageIndex}
                      />
                    </div>
                    
                    {/* Single Image */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">صورة واحدة</label>
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

                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    تفاصيل المنتج
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">
                        اسم المنتج <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="أدخل اسم المنتج"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-white/50 focus:border-luxury-gold focus:outline-none"
                        style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">
                        الفئة <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:border-luxury-gold focus:outline-none [&>option]:bg-background [&>option]:text-foreground"
                        style={{ backgroundColor: '#0a1628', color: '#ffffff', colorScheme: 'dark' }}
                        required
                      >
                        <option value="" className="bg-background text-foreground">اختر الفئة</option>
                        <option value="oud" className="bg-background text-foreground">عود</option>
                        {/* <option value="perfumes" className="bg-background text-foreground">عطور</option>
                        <option value="cosmetics" className="bg-background text-foreground">مستحضرات تجميل</option>
                        <option value="skincare" className="bg-background text-foreground">العناية بالبشرة</option>
                        <option value="men" className="bg-background text-foreground">رجالي</option>
                        <option value="women" className="bg-background text-foreground">نسائي</option>
                        <option value="kids" className="bg-background text-foreground">أطفال</option> */}
                      </select>
                    </div>

                    {/* Brand */}
                    <div>
                      <BrandSelect
                        value={formData.brand}
                        onChange={(value) => setFormData({...formData, brand: value})}
                        label="العلامة التجارية"
                        required={true}
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">
                        الجنس المستهدف <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:border-luxury-gold focus:outline-none [&>option]:bg-background [&>option]:text-foreground"
                        style={{ backgroundColor: '#0a1628', color: '#ffffff', colorScheme: 'dark' }}
                        required
                      >
                        <option value="" className="bg-background text-foreground">اختر الجنس</option>
                        <option value="men" className="bg-background text-foreground">رجالي</option>
                        <option value="women" className="bg-background text-foreground">نسائي</option>
                        <option value="unisex" className="bg-background text-foreground">للجنسين</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">
                        السعر الأساسي <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="أدخل السعر"
                        min="0"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-white/50 focus:border-luxury-gold focus:outline-none"
                        style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                        required
                      />
                    </div>

                    {/* Sale Price */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">سعر التخفيض</label>
                      <input
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                        placeholder="سعر التخفيض (اختياري)"
                        min="0"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-white/50 focus:border-luxury-gold focus:outline-none"
                        style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">
                        الكمية المتاحة <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.totalStock}
                        onChange={(e) => setFormData({...formData, totalStock: e.target.value})}
                        placeholder="أدخل الكمية"
                        min="0"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-white/50 focus:border-luxury-gold focus:outline-none"
                        style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                        required
                      />
                    </div>

                    {/* Size */}
                    <div>
                      <label className="text-foreground font-medium mb-2 block">الحجم</label>
                      <input
                        type="text"
                        value={formData.size}
                        onChange={(e) => setFormData({...formData, size: e.target.value})}
                        placeholder="مثال: 100ml, 50ml"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-white/50 focus:border-luxury-gold focus:outline-none"
                        style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-foreground font-medium mb-2 block">
                      وصف المنتج <span className="text-red-400">*</span>
                    </label>
                      <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="أدخل وصف مفصل للمنتج"
                      rows="4"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-white/50 focus:border-luxury-gold focus:outline-none resize-none"
                      style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-border">
                  <Button
                    type="submit"
                    disabled={imageLoadingStatus || !isFormValid()}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 text-lg rounded-xl shadow-[0_0_20px_rgba(210,176,101,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {imageLoadingStatus ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-luxury-navy border-t-transparent rounded-full animate-spin"></div>
                        جاري الرفع...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <PlusCircle className="w-6 h-6" />
                        {currentEditId ? "تحديث المنتج" : "إضافة المنتج"}
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductsSimple;


