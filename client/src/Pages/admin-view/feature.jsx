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
import { Trash2, Monitor, Smartphone, Sparkles } from "lucide-react";

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
    <section className="px-6 py-10 bg-[#0B0F19]/95 backdrop-blur-2xl min-h-screen rounded-2xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
      <h2 className="text-4xl font-extrabold text-white mb-10 tracking-wide flex items-center justify-center gap-3">
  <Sparkles size={28} className="text-emerald-400 animate-spin-slow" />
  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent animate-pulse">
    Feature Banner Management
  </span>
  <Sparkles size={28} className="text-emerald-400 animate-spin-slow" />
</h2>

      {/* Desktop Upload */}
      <div className="mb-12 bg-white/5 rounded-xl border border-emerald-500/20 p-6 shadow-lg ">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Monitor size={20} className="text-emerald-400" /> Desktop Banner
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
          className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-[0_0_10px_rgba(16,185,129,0.6)]"
        >
          Upload Desktop
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {featureImageList?.map((featureImageItem) => (
            <div
              key={featureImageItem._id}
              className=" relative rounded-xl overflow-hidden border border-white/10 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition"
            >
              <img
                src={featureImageItem.image}
                alt="Desktop Feature"
                className="w-full h-[250px] object-cover"
              />
              <Button
                onClick={() => handleDeleteFeature(featureImageItem._id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Upload */}
      <div className="bg-white/5 rounded-xl border border-emerald-500/20 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Smartphone size={20} className="text-emerald-400" /> Mobile Banner
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
          className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-[0_0_10px_rgba(16,185,129,0.6)]"
        >
          Upload Mobile
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {featureImageListMobile?.map((featureImageItem) => (
            <div
              key={featureImageItem._id}
              className="relative rounded-xl overflow-hidden border border-white/10 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition"
            >
              <img
                src={featureImageItem.image}
                alt="Mobile Feature"
                className="w-full h-[400px] object-cover"
              />
              <Button
                onClick={() => handleDeleteFeature(featureImageItem._id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminFeatures;
