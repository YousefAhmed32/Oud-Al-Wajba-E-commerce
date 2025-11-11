import { Input } from "@/components/ui/input";
import { fetchAllFilteredProducts, setProductDetails } from "@/store/shop/products-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ShoppingProductTitle from "@/components/shopping-view/product-title";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

function SearchProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(initialKeyword);
  const [openDetailsDialog,setOpenDetailsDialog]=useState(false)
  const{productDetails, productList, isLoading} = useSelector(state=>state.shopProducts)
  const dispatch = useDispatch();
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
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length > 0) {
      const delay = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${encodeURIComponent(trimmedKeyword)}`));
        dispatch(
          fetchAllFilteredProducts({ 
            filtersParams: { keyword: trimmedKeyword }, 
            sortParams: 'price-lowtohigh' 
          })
        ).catch((error) => {
          console.error("Search error:", error);
          toast({
            title: "Error searching products",
            variant: "destructive",
          });
        });
      }, 1000);

      return () => clearTimeout(delay);
    } else {
        setSearchParams(new URLSearchParams());
    }
  }, [keyword, dispatch, setSearchParams, toast]);

  // Sync keyword with URL params when they change externally
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    if (urlKeyword !== keyword) {
      setKeyword(urlKeyword);
    }
  }, [searchParams]);

  // Clear product details when component mounts to prevent showing product details dialog
  useEffect(() => {
    dispatch(setProductDetails());
    setOpenDetailsDialog(false);
  }, []); // Only run on mount

  // Initial search when component mounts with keyword from URL
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    if (urlKeyword && urlKeyword.trim().length > 0) {
      dispatch(
        fetchAllFilteredProducts({ 
          filtersParams: { keyword: urlKeyword.trim() }, 
          sortParams: 'price-lowtohigh' 
        })
      ).catch((error) => {
        console.error("Search error:", error);
        toast({
          title: "Error searching products",
          variant: "destructive",
        });
      });
    }
  }, []); // Only run on mount

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

      {keyword.trim().length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {isLoading ? (
            <h1 className="text-3xl">Loading...</h1>
          ) : productList && productList.length > 0 ? (
            productList.map((item) => (
              <ShoppingProductTitle handleAddToCart={handleAddToCart} key={item._id} product={item} />
            ))
          ) : (
            <h1 className="text-5xl font-extrabold">No result found!</h1>
          )}
        </div>
      )}
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
