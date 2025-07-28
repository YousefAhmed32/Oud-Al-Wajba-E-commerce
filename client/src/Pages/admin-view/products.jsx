import ProductImageUpload from "@/components/admin-view/image-uploud";
import AdminProductTitle from "@/components/admin-view/product-title";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { PlusCircle, Pencil } from "lucide-react";


const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingStatus, setImageLoadingState] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditId) {
      dispatch(
        editProduct({
          id: currentEditId,
          formData: {
            ...formData,
            image: uploadedImageUrl,
          },
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProduct());
          resetForm();
          toast({ title: "✅ Product updated successfully" });
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProduct());
          resetForm();
          toast({ title: "✅ Product added successfully" });
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
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);

  return (
    <Fragment>
      {/* Top Bar */}
      <div className="flex justify-end w-full mb-6">
        <Button
          onClick={() => setOpenCreateProductDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
        >
          <PlusCircle size={18} /> Add New Product
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {productList?.length > 0 &&
          productList.map((productItem) => (
            <AdminProductTitle
              key={productItem._id}
              product={productItem}
              setFormData={setFormData}
              setOpenCreateProductDialog={setOpenCreateProductDialog}
              setCurrentEditId={setCurrentEditId}
              handleDelete={handleDelete}
            />
          ))}
      </div>

      {/* Add/Edit Drawer */}
   

<Sheet open={openCreateProductDialog} onOpenChange={() => resetForm()}>
  <SheetContent
    side="right"
    className="overflow-auto bg-gradient-to-b from-[#0B0F19] to-[#0E1425] text-white border-l border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
  >
    <SheetHeader className="border-b border-white/10 pb-4">
      <SheetTitle className="text-xl font-semibold flex items-center gap-3 text-white">
        {currentEditId !== null ? (
          <>
            <Pencil className="w-5 h-5 text-emerald-400" />
            Edit Product
          </>
        ) : (
          <>
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            Add New Product
          </>
        )}
      </SheetTitle>
    </SheetHeader>

    {/* Upload Section */}
    <div className="mt-6">
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

    {/* Form Section */}
    <div className="py-6">
      <CommonForm
        onSubmit={onSubmit}
        formData={formData}
        setFormData={setFormData}
        buttonText={currentEditId ? "Update Product" : "Add Product"}
        formControls={addProductFormElements}
        isBtnDisabled={!isFormValid()}
        labelClassName="text-white"
      />
    </div>
  </SheetContent>
</Sheet>

    </Fragment>
  );
}

export default AdminProducts;
