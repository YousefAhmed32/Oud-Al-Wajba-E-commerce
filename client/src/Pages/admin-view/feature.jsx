import ProductImageUpload from "@/components/admin-view/image-uploud";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  addFeatureImage,
  deleteFeatureImages,
  getFeatureImage,
  getFeatureImageMobile,
} from "@/store/shop/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Trash2, 
  Monitor, 
  Smartphone, 
  ImageIcon, 
  Upload, 
  Edit3, 
  Eye, 
  Download,
  RefreshCw,
  Plus,
  X
} from "lucide-react";

function AdminFeatures() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingStatus, setImageLoadingState] = useState(false);
  const { toast } = useToast();
  const { featureImageList, featureImageListMobile } = useSelector(
    (state) => state.commonFeature
  );
  const dispatch = useDispatch();

  const handleUploadFeatureImage = () => {
    dispatch(addFeatureImage({ image: uploadedImageUrl, device: "desktop" })).then((res) => {
      if (res?.payload?.success) {
        dispatch(getFeatureImage());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  };

  const handleUploadFeatureImageMobile = () => {
    dispatch(addFeatureImage({ image: uploadedImageUrl, device: "mobile" })).then((res) => {
      if (res?.payload?.success) {
        dispatch(getFeatureImageMobile());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  };

  function handleDeleteFeature(getCurrentProductId) {
    dispatch(deleteFeatureImages(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImage());
        dispatch(getFeatureImageMobile());
        toast({ title: "Banner deleted successfully" });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImage());
    dispatch(getFeatureImageMobile());
  }, [dispatch]);

  return (
    <div className="min-h-screen luxury-gradient p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gold-950/20 backdrop-blur-sm">
              <ImageIcon className="w-8 h-8 text-gold-950" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white glow-text">
              إدارة البانرات
            </h1>
          </div>
          <p className="text-gold-300 text-lg max-w-2xl mx-auto">
            إدارة صور البانر الرئيسية للصفحة الرئيسية - سطح المكتب والهاتف المحمول
          </p>
        </div>

        {/* Desktop Banner Section */}
        <div className="mb-12">
          <div className="perfume-card p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gold-950/20">
                <Monitor className="w-6 h-6 text-gold-950" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">بانر سطح المكتب</h2>
                <p className="text-gold-300">صور البانر للشاشات الكبيرة</p>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-navy-950/30 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-gold-950" />
                رفع صورة جديدة
              </h3>
              
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingStatus={imageLoadingStatus}
                isCustomStyling={true}
                className=""
              />

              <Button
                onClick={handleUploadFeatureImage}
                disabled={!uploadedImageUrl || imageLoadingStatus}
                className="mt-4 w-full bg-gold-950 hover:bg-gold-800 text-navy-950 font-semibold glow-gold flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                رفع بانر سطح المكتب
              </Button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureImageList?.map((featureImageItem, index) => (
                <div
                  key={featureImageItem._id}
                  className="group relative rounded-xl overflow-hidden perfume-card hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={featureImageItem.image}
                      alt={`Desktop Banner ${index + 1}`}
                      className="w-full h-[300px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteFeature(featureImageItem._id)}
                        size="sm"
                        className="bg-red-600/80 hover:bg-red-700 text-white backdrop-blur-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-2">بانر سطح المكتب #{index + 1}</h4>
                    <p className="text-gold-300 text-sm">حجم: 1920x600 بكسل</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Banner Section */}
        <div className="mb-12">
          <div className="perfume-card p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gold-950/20">
                <Smartphone className="w-6 h-6 text-gold-950" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">بانر الهاتف المحمول</h2>
                <p className="text-gold-300">صور البانر للشاشات الصغيرة</p>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-navy-950/30 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-gold-950" />
                رفع صورة جديدة
              </h3>
              
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingStatus={imageLoadingStatus}
                isCustomStyling={true}
              />

              <Button
                onClick={handleUploadFeatureImageMobile}
                disabled={!uploadedImageUrl || imageLoadingStatus}
                className="mt-4 w-full bg-gold-950 hover:bg-gold-800 text-navy-950 font-semibold glow-gold flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                رفع بانر الهاتف المحمول
              </Button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureImageListMobile?.map((featureImageItem, index) => (
                <div
                  key={featureImageItem._id}
                  className="group relative rounded-xl overflow-hidden perfume-card hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={featureImageItem.image}
                      alt={`Mobile Banner ${index + 1}`}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteFeature(featureImageItem._id)}
                        size="sm"
                        className="bg-red-600/80 hover:bg-red-700 text-white backdrop-blur-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-2">بانر الهاتف المحمول #{index + 1}</h4>
                    <p className="text-gold-300 text-sm">حجم: 768x1024 بكسل</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="perfume-card p-6 rounded-xl text-center">
            <div className="p-3 rounded-full bg-gold-950/20 w-fit mx-auto mb-4">
              <Monitor className="w-6 h-6 text-gold-950" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{featureImageList?.length || 0}</h3>
            <p className="text-gold-300">بانرات سطح المكتب</p>
          </div>
          
          <div className="perfume-card p-6 rounded-xl text-center">
            <div className="p-3 rounded-full bg-gold-950/20 w-fit mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-gold-950" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{featureImageListMobile?.length || 0}</h3>
            <p className="text-gold-300">بانرات الهاتف المحمول</p>
          </div>
          
          <div className="perfume-card p-6 rounded-xl text-center">
            <div className="p-3 rounded-full bg-gold-950/20 w-fit mx-auto mb-4">
              <ImageIcon className="w-6 h-6 text-gold-950" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{(featureImageList?.length || 0) + (featureImageListMobile?.length || 0)}</h3>
            <p className="text-gold-300">إجمالي البانرات</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFeatures;
