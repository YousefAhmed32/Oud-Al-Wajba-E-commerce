import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

function AdminProductTitle({
  product,
  setOpenCreateProductDialog,
  setFormData,
  setCurrentEditId,
  handleDelete,
}) {
  const stockColor =
    product?.totalStock > 10
      ? "bg-emerald-600"
      : product?.totalStock > 0
      ? "bg-yellow-500"
      : "bg-red-600";

  const handleEdit = () => {
    setCurrentEditId(product._id || product.id);
    setFormData({
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      image: product.image || "",
      totalStock: product.totalStock || "",
    });
    setOpenCreateProductDialog(true);
  };

  return (
    <Card className="w-full max-w-sm mx-auto border border-emerald-500/30 bg-gradient-to-br from-[#0B0F19] via-black to-[#0B0F19] text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-xl overflow-hidden transition-transform hover:scale-[1.02]">
      {/* Product Image */}
      <div className="relative">
        {product?.image ? (
          <img
            src={product.image}
            alt={product.title || "Product image"}
            className="w-full h-[280px] object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-[280px] flex items-center justify-center bg-gray-800 text-gray-400 rounded-t-xl">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold truncate">{product?.title}</h2>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${stockColor} shadow-md`}
          >
            {product?.totalStock}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex justify-between items-end">
          {product?.price > product?.salePrice ? (
            <span className="text-sm line-through text-gray-400">
              ${product?.price}
            </span>
          ) : (
            <span className="text-sm text-gray-200">${product?.price}</span>
          )}
          {product?.salePrice > 0 && (
            <span className="text-lg font-bold text-emerald-400">
              ${product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex justify-between px-4 pb-4">
        <Button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)]"
          onClick={handleEdit}
        >
          <Pencil size={16} /> Edit
        </Button>
        <Button
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_10px_rgba(239,68,68,0.6)]"
          onClick={() => handleDelete({ id: product?._id })}
        >
          <Trash2 size={16} /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTitle;
