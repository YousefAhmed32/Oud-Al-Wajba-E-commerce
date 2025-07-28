import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightningIcon,
  Codepen,
  Figma,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";

// import bannerTwo from "../../assets/try-2.webp";
// import bannerThree from "../../assets/try-3.webp";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSwipeable } from 'react-swipeable';
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTitle from "@/components/shopping-view/product-title";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImage, getFeatureImageMobile } from "@/store/shop/common-slice";

const categoryWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightningIcon },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { featureImageList,featureImageListMobile } = useSelector((state) => state.commonFeature);

  // const listForMobile=[bannerOneForMoblie,bannerTwoForMoblie]

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentSlide((prev) => (prev + 1) % featureImageListMobile.length),
    onSwipedRight: () =>
      setCurrentSlide((prev) => (prev - 1 + featureImageListMobile.length) % featureImageListMobile.length),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: "Product added to cart" });
        }
      });
  }

  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({
      filtersParams: {},
      sortParams: "price-lowtohight",
    }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImage());
    dispatch(getFeatureImageMobile());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
     <div className="relative w-full h-[600px] overflow-hidden">
      {/* Mobile Swipeable Image */}
      <div {...swipeHandlers} className="block sm:hidden w-full h-full">
        <img
          src={featureImageListMobile[currentSlide % featureImageListMobile.length]?.image}
          alt="Mobile Banner"
          className="w-full h-full object-cover rounded-lg shadow-xl shadow-white/10"
        />
      </div>

      {/* Desktop Images with Buttons */}
      <div className="hidden sm:block w-full h-full relative">
        {featureImageList.map((slide, index) => (
          <img
            src={slide.image}
            key={index}
            className={`absolute w-full top-0 left-0 h-full object-cover transition-opacity duration-1000 rounded-lg shadow-xl shadow-white/10 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        >
          <ChevronLeftIcon className="w-4 h-4 text-black" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        >
          <ChevronRightIcon className="w-4 h-4 text-black" />
        </Button>
      </div>
    </div>



<section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
  <div className="container mx-auto px-4">
    {/* Glowing heading */}
    <h2 className="text-4xl font-extrabold text-center mb-14 text-white tracking-wider relative z-10">
      <span className="glow-text">Shop by Category</span>
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 z-10 relative">
      {categoryWithIcon.map((categoryItems) => (
          <Card
            key={categoryItems.id}
            onClick={() => handleNavigateToListingPage(categoryItems, "category")}
          className="cursor-pointer relative group bg-gradient-to-br  via-white/2 to-black border border-white/10 rounded-2xl overflow-hidden
                     hover:scale-105 transition-transform duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.1)]  lg:hover:bottom-2  "
        >
          {/* Shimmering overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black to-slate-950 opacity-0 group-hover:opacity-60 transition-all duration-700 blur-sm pointer-events-none" />

          {/* Animated lines from corners */}
          <div className="absolute -top-1 -left-1 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-white-900 to-transparent animate-slideDown" />
            <div className="absolute top-0 right-0 h-0.5 w-full bg-gradient-to-r from-white-900 to-transparent animate-slideRight" />
            <div className="absolute bottom-0 right-0 w-0.8 h-full bg-gradient-to-t from-white-900 to-transparent animate-slideUp" />
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-l from-white-900 to-transparent animate-slideLeft" />
          </div>

          <CardContent className="flex flex-col items-center justify-center p-6 text-white relative z-10">
            <categoryItems.icon className="w-14 h-14 mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold text-lg drop-shadow-sm">{categoryItems.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>

  {/* Glowing animated background lines */}
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-white/20 to-transparent animate-glowLine" />
</section>



  <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
    <div className="container mx-auto px-4 relative z-10">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-14 text-white tracking-wider glow-text">
        Shop by Brand
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
        {brandsWithIcon.map((brandItem) => (
          <Card
            key={brandItem.id}
            onClick={() => handleNavigateToListingPage(brandItem, "brand")}
            className="cursor-pointer relative group bg-gradient-to-br from-white via-white/5 to-black border border-white/10 rounded-2xl overflow-hidden 
                      hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(236,72,153,0.25)]
                      hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]"
          >
            {/* Neon overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition duration-500 pointer-events-none rounded-2xl blur-sm" />

            {/* Corner animated lines (optional) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-black to-transparent animate-slideDown" />
              <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-black to-transparent animate-slideUp" />
            </div>

            <CardContent className="flex flex-col items-center justify-center p-6 text-white relative z-10">
              <brandItem.icon className="w-14 h-14 mb-4 text-white  transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold text-lg drop-shadow-sm">{brandItem.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    {/* Optional glowing line down the center */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-pink-500/20 to-transparent animate-glowLine" />
  </section>




  <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
  {/* Animated Gradient Background Lines */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-0 w-1 h-full bg-white/10 animate-slideDown rounded-full"></div>
    <div className="absolute bottom-0 right-0 w-1 h-full bg-white/10 animate-slideUp rounded-full"></div>
    <div className="absolute top-1/2 left-0 h-1 w-full bg-white/5 animate-slideRight"></div>
    <div className="absolute top-1/3 right-0 h-1 w-full bg-white/5 animate-slideLeft"></div>
  </div>

  {/* Section Content */}
  <div className="relative container mx-auto px-4 z-10">
  <h2 className="text-4xl font-extrabold text-center text-white mb-12 tracking-wider uppercase glow-text relative before:absolute before:inset-0 before:blur-md before:bg-gradient-to-r before:from-pink-500 before:to-blue-500 before:opacity-40">
    Featured Products
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {productList?.length > 0 &&
      productList.map((productItem) => (
        <div
          key={productItem._id}
          className="relative overflow-hidden rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur-lg group shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-300"
        >
          {/* Glowing border on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500 rounded-2xl pointer-events-none"></div>

          {/* Inner glowing edge line */}
          <div className="absolute inset-[1px] rounded-[inherit] bg-black/60 z-[1]"></div>

          {/* Content layer */}
          <div className="relative z-[2]">
            <ShoppingProductTitle
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
              product={productItem}
            />
          </div>
        </div>
      ))}
  </div>
</div>

</section>



      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;

// Add this to your global CSS or Tailwind config
// .glow-text {
//   text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
// }
