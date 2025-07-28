import { Input } from "@/components/ui/input";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ShoppingProductTitle from "@/components/shopping-view/product-title";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

function SearchProducts() {


  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog,setOpenDetailsDialog]=useState(false)
  const{productDetails} = useSelector(state=>state.shopProducts)
  const dispatch = useDispatch();

  const { searchResults, isLoading } = useSelector(
    (state) => state.shopSearch
  );
  const {cartItems} = useSelector(state=>state.shopCart)
  const {user} = useSelector(state=>state.auth)
  const {toast} = useToast()

  function handleAddToCart(getCurrentProductId , getTotalStock) {
      console.log(cartItems);
      let getCartItems = cartItems.items || []
      if(getCartItems.length){
        const indexOfCurrentItem=getCartItems.findIndex(item=>item.productId === getCurrentProductId)
  
        if(indexOfCurrentItem > -1){
          const getQuantity = getCartItems[indexOfCurrentItem].quantity
          if(getQuantity + 1 > getTotalStock){
            toast({
              title:`Only ${getQuantity} quantity can be added for this item`,
              variant:'destructive'
            })
            return
          }
        }
           
      }
  
      dispatch(
        addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id))
           toast({
              title: "Product is add to cart",
            });
        }
  
        console.log(data,"data listing yousef");
      });
    }

  useEffect(() => {
    if (keyword.trim().length > 0) {
      const delay = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);

      return () => clearTimeout(delay);
    }else{
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));

        dispatch(resetSearchResults())
    }
  }, [keyword]);

 function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }
   useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="search"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products....."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {isLoading ? (
          <h1 className="text-3xl">Loading...</h1>
        ) : searchResults.length > 0 ? (
          searchResults.map((item) => (
            <ShoppingProductTitle handleAddToCart={handleAddToCart} key={item._id} product={item} />
          ))
        ) : (
          <h1 className="text-5xl font-extrabold">No result found!</h1>
        )}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleGetProductDetails={handleGetProductDetails}
      />
    </div>
  );
}

export default SearchProducts;
