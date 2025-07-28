import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCouponFormElements } from "@/config";
import { addCoupon, fetchAllCoupons } from "@/store/admin/coupon";
import CommonForm from "../../components/common/form";
import { Sparkles, PlusCircle, Ticket, Loader2 } from "lucide-react";

function AdminCoupon() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { couponList = [], isLoading } = useSelector((state) => state.adminCoupon);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  await dispatch(
    addCoupon({
      code: formData.code,
      discount: formData.discountType,
      discountValue: Number(formData.discountValue),
      expiryDate: formData.expiryDate,
      usageLimit: Number(formData.usageLimit || 1),
    })
  );

  await dispatch(fetchAllCoupons()); // ✅ refresh list immediately

  setSubmitting(false);
};

  useEffect(() => {
    dispatch(fetchAllCoupons());
  }, [dispatch]);

  return (
    <section className="px-4 sm:px-6 py-12 bg-gradient-to-b from-black via-zinc-900 to-black min-h-screen rounded-[24px]">
      {/* Header */}
      <h2 className="text-4xl font-extrabold text-center mb-12 flex items-center justify-center gap-3">
        <Sparkles className="text-emerald-400 animate-pulse" size={32} />
        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
          Manage Your Coupons Elegantly
        </span>
        <Sparkles className="text-emerald-400 animate-pulse" size={32} />
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {/* Form Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <PlusCircle className="text-emerald-400" size={24} /> Create New Coupon
          </h3>

          <CommonForm
            formControls={addCouponFormElements}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            buttonText={
              submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Adding...
                </span>
              ) : (
                "Add Coupon"
              )
            }
            isBtnDisabled={submitting}
            labelClassName="text-white text-sm font-medium"
            inputClassName="bg-white/10 text-white placeholder-white/60 border border-white/20 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg px-4 py-2 w-full transition duration-150"
          />

          {/* Preview */}
          <div className="mt-6 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur shadow-inner">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Ticket className="text-yellow-300" size={20} /> Preview
            </h4>
            <div className="space-y-1 text-white/90 text-sm">
              <p>
                <span className="text-gray-400">Code:</span>{" "}
                <span className="font-bold text-green-400">{formData.code || "N/A"}</span>
              </p>
              <p>
                <span className="text-gray-400">Discount:</span>{" "}
                <span className="font-bold text-yellow-400">
                  {formData.discountType === "percentage"
                    ? `${formData.discountValue || 0}%`
                    : `${formData.discountValue || 0} EGP`}{" "}
                  off
                </span>
              </p>
              <p>
                <span className="text-gray-400">Expiry:</span>{" "}
                {formData.expiryDate || "No date selected"}
              </p>
            </div>
          </div>
        </div>

        {/* Coupon List Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Ticket className="text-emerald-400" size={24} /> All Coupons
          </h3>

          {isLoading ? (
            <p className="text-white flex items-center gap-2">
              <Loader2 className="animate-spin" /> Loading...
            </p>
          ) : couponList.length === 0 ? (
            <p className="text-gray-400 italic">No coupons found.</p>
          ) : (
            <ul className="space-y-4">
              {couponList.map((coupon) => (
                <li
                  key={coupon._id}
                  className="bg-white/10 hover:bg-white/20 transition-colors p-5 rounded-xl border border-white/20 text-white shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-bold flex items-center gap-2">
                      <Ticket size={18} className="text-emerald-400" /> {coupon.code}
                    </p>
                    <p className="text-sm text-yellow-300">
                      {coupon.discount === "percentage"
                        ? `${coupon.discountValue}% off`
                        : `${coupon.discountValue} EGP off`}
                    </p>
                  </div>
                  <div className="text-sm text-right text-gray-300">
                    <p>
                      Uses:{" "}
                      <span className="text-white font-semibold">
                        {coupon.usedCount}/{coupon.usageLimit}
                      </span>
                    </p>
                    <p>Expires: {coupon.expiryDate?.slice(0, 10) || "No expiry"}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminCoupon;
