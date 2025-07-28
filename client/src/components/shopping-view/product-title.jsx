import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

function ShoppingProductTitle({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  return (
   <Card className="w-full max-w-sm mx-auto bg-black backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden relative transition-all duration-300 group hover:scale-[1.04] hover:shadow-white/30">

  {/* Glowing border effect */}
  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-30 blur-md transition-all duration-500 pointer-events-none z-0" />

  {/* Top Section - Image */}
  <div onClick={() => handleGetProductDetails(product?._id)} className="relative cursor-pointer z-10">
    <div className="relative overflow-hidden">
      {/* Gradient glow behind image */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-purple-500/10 to-blue-500/10 blur-xl opacity-40 pointer-events-none z-0" />

      <img
        src={product?.image}
        alt={product?.title}
        className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-500 rounded-t-2xl relative z-10"
      />

      {/* Badge */}
      {product?.totalStock === 0 ? (
        <Badge className="absolute top-3 left-3 animate-pulse bg-red-600 text-white shadow-md z-20">
          Out Of Stock
        </Badge>
      ) : product?.totalStock < 10 ? (
        <Badge className="absolute top-3 left-3 bg-yellow-500 text-black shadow-md z-20">
          Only {product?.totalStock} left
        </Badge>
      ) : product?.salePrice > 0 ? (
        <Badge className="absolute top-3 left-3 bg-pink-600 text-white shadow-md z-20">
          Sale
        </Badge>
      ) : null}
    </div>

    {/* Text Content */}
    <CardContent className="p-4 text-white relative z-10">
      <h2 className="text-xl font-bold mb-2 truncate">{product?.title}</h2>

      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>{categoryOptionsMap[product?.category]}</span>
        <span>{brandOptionsMap[product?.brand]}</span>
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`${
            product?.salePrice > 0 ? "line-through text-red-300" : "text-white"
          } text-base font-semibold`}
        >
          ${product?.price}
        </span>

        {product?.salePrice > 0 && (
          <span className="text-base font-semibold text-green-400">
            ${product?.salePrice}
          </span>
        )}
      </div>
    </CardContent>
  </div>

  {/* Footer - Buttons */}
  <CardFooter className="p-4 pt-2 relative z-10">
    {product?.totalStock === 0 ? (
      <Button className="w-full opacity-50 cursor-not-allowed bg-red-500 hover:bg-red-500 text-white">
        Out Of Stock
      </Button>
    ) : (
      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-md"
        onClick={() => handleAddToCart(product?._id, product?.totalStock)}
      >
        Add to cart
      </Button>
    )}
  </CardFooter>
</Card>


  );
}

export default ShoppingProductTitle;
