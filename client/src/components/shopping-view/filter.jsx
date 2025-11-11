import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { Fragment, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands, fetchPriceRange } from "@/store/shop/products-slice";
import { Input } from "@/components/ui/input";
import { Filter, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function ProductFiler({ filters, handleFilters, handlePriceChange }) {
  const dispatch = useDispatch();
  const { brands, priceRange } = useSelector((state) => state.shopProducts);
  const [priceRangeLocal, setPriceRangeLocal] = useState({
    minPrice: priceRange?.minPrice || 0,
    maxPrice: priceRange?.maxPrice || 1000,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchPriceRange());
  }, [dispatch]);

  useEffect(() => {
    if (priceRange.minPrice !== undefined && priceRange.maxPrice !== undefined) {
      setPriceRangeLocal({
        minPrice: filters?.minPrice ?? priceRange.minPrice,
        maxPrice: filters?.maxPrice ?? priceRange.maxPrice,
      });
    }
  }, [priceRange, filters]);

  const handleMinPriceChange = (e) => {
    const value = parseFloat(e.target.value) || priceRange.minPrice;
    const newRange = {
      ...priceRangeLocal,
      minPrice: Math.min(value, priceRangeLocal.maxPrice),
    };
    setPriceRangeLocal(newRange);
    if (handlePriceChange) {
      handlePriceChange(newRange);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = parseFloat(e.target.value) || priceRange.maxPrice;
    const newRange = {
      ...priceRangeLocal,
      maxPrice: Math.max(value, priceRangeLocal.minPrice),
    };
    setPriceRangeLocal(newRange);
    if (handlePriceChange) {
      handlePriceChange(newRange);
    }
  };

  const handleMinPriceSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    const newRange = {
      ...priceRangeLocal,
      minPrice: Math.min(value, priceRangeLocal.maxPrice),
    };
    setPriceRangeLocal(newRange);
    if (handlePriceChange) {
      handlePriceChange(newRange);
    }
  };

  const handleMaxPriceSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    const newRange = {
      ...priceRangeLocal,
      maxPrice: Math.max(value, priceRangeLocal.minPrice),
    };
    setPriceRangeLocal(newRange);
    if (handlePriceChange) {
      handlePriceChange(newRange);
    }
  };

  const activeFiltersCount = (filters?.brands?.length || 0) + 
    ((filters?.minPrice || filters?.maxPrice) ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group "
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
      <div className="relative bg-white dark:bg-gradient-to-br dark:from-navy-950/90 dark:to-black/90 backdrop-blur-xl rounded-2xl border border-gold-500/20 shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gold-500/10 dark:border-gold-500/20 bg-gradient-to-r from-gold-50/50 to-transparent dark:from-gold-500/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/30">
                <Filter className="w-5 h-5 text-gold-600 dark:text-gold-400" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 dark:from-gold-400 dark:via-gold-300 dark:to-gold-400 bg-clip-text text-transparent">
                الفلاتر
              </h2>
            </div>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 dark:bg-gold-500/30 border border-gold-500/30">
                <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
                <span className="text-xs font-bold text-gold-700 dark:text-gold-300">
                  {activeFiltersCount}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gold-300/70">
            اختر الفلاتر المناسبة للعثور على منتجك المثالي
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
          {/* Brands Filter */}
          {brands && brands.length > 0 && (
            <Fragment>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gold-300 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  الماركات
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {brands.map((brand) => {
                    const brandId = brand._id || brand.id;
                    const brandName = brand.nameEn || brand.name;
                    const isChecked = filters?.brands?.includes(brandId);
                    return (
                      <motion.div
                        key={brandId}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Label
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer select-none transition-all duration-300 ${
                            isChecked
                              ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 dark:from-gold-500/20 dark:to-gold-600/10 border-2 border-gold-500/40 dark:border-gold-500/40'
                              : 'bg-gray-50 dark:bg-navy-900/50 border-2 border-transparent hover:border-gold-500/20 dark:hover:border-gold-500/20'
                          }`}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => handleFilters("brands", brandId)}
                            className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-950 data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-500 data-[state=checked]:text-white hover:border-gold-400 dark:hover:border-gold-500 transition-all duration-200"
                          />
                          <span className={`font-medium flex-1 ${
                            isChecked 
                              ? 'text-gold-700 dark:text-gold-300' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {brandName}
                          </span>
                          {isChecked && (
                            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                          )}
                        </Label>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <Separator className="bg-gold-500/20 dark:bg-gold-500/20" />
            </Fragment>
          )}

          {/* Price Range Filter */}
          {priceRange.minPrice !== undefined && priceRange.maxPrice !== undefined && (
            <div className="bg-gradient-to-br from-gold-50/50 to-transparent dark:from-gold-500/5 dark:to-transparent rounded-2xl p-6 border-2 border-gold-500/20 dark:border-gold-500/30 shadow-inner">
              <h3 className="text-base font-bold text-gray-900 dark:text-gold-300 mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-500" />
                نطاق السعر
              </h3>

              <div className="space-y-5">
                {/* Price Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gold-300/70 mb-2 block">
                      الحد الأدنى
                    </label>
                    <input
                      type="number"
                      min={priceRange.minPrice}
                      max={priceRange.maxPrice}
                      value={priceRangeLocal.minPrice}
                      onChange={handleMinPriceChange}
                      className="w-full rounded-xl border-2 border-gold-500/30 dark:border-gold-500/40 bg-white dark:bg-navy-950 text-gray-900 dark:text-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 dark:focus:border-gold-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gold-300/70 mb-2 block">
                      الحد الأقصى
                    </label>
                    <input
                      type="number"
                      min={priceRange.minPrice}
                      max={priceRange.maxPrice}
                      value={priceRangeLocal.maxPrice}
                      onChange={handleMaxPriceChange}
                      className="w-full rounded-xl border-2 border-gold-500/30 dark:border-gold-500/40 bg-white dark:bg-navy-950 text-gray-900 dark:text-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 dark:focus:border-gold-400 transition-all"
                    />
                  </div>
                </div>

                {/* Slider Section */}
                <div className="relative pt-2">
                  <div className="relative h-2 bg-gray-200 dark:bg-navy-800 rounded-full">
                    <div 
                      className="absolute h-2 bg-gradient-to-r from-gold-400 to-gold-600 dark:from-gold-500 dark:to-gold-400 rounded-full"
                      style={{
                        left: `${((priceRangeLocal.minPrice - priceRange.minPrice) / (priceRange.maxPrice - priceRange.minPrice)) * 100}%`,
                        width: `${((priceRangeLocal.maxPrice - priceRangeLocal.minPrice) / (priceRange.maxPrice - priceRange.minPrice)) * 100}%`
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min={priceRange.minPrice}
                    max={priceRange.maxPrice}
                    value={priceRangeLocal.minPrice}
                    onChange={handleMinPriceSliderChange}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                  />
                  <input
                    type="range"
                    min={priceRange.minPrice}
                    max={priceRange.maxPrice}
                    value={priceRangeLocal.maxPrice}
                    onChange={handleMaxPriceSliderChange}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                  />
                </div>

                {/* Range Display */}
                <div className="text-center p-4 rounded-xl bg-white dark:bg-navy-900/80 border-2 border-gold-500/30 dark:border-gold-500/40">
                  <div className="text-xs text-gray-600 dark:text-gold-300/70 mb-1">النطاق المحدد</div>
                  <div className="text-lg font-bold bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 dark:from-gold-400 dark:via-gold-300 dark:to-gold-400 bg-clip-text text-transparent">
                    {priceRangeLocal.minPrice} – {priceRangeLocal.maxPrice} QR
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductFiler;
