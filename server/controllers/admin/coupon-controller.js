const Coupon = require("../../models/Coupon");

// Create Coupon
const createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json({ 
            success: true, 
            coupon 
        });
    } catch (e) {
      console.log(e)
        res.status(400).json({ success: false, message: "Error is here" });
    }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error is here" });
  }
};


const updateCoupon = async (req, res) => {
  try {
    const {id} =req.params
    const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, coupon: updated });
  } catch (err) {
      res.status(400).json({ success: false, message: "Error is here" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const {id} =req.params

    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (err) {
          res.status(400).json({ success: false, message: "Error is here" });
  }
};
module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};