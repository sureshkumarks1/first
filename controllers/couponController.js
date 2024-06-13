const Coupon = require("../models/couponModel");
const validateMongoDbId = require("../helper/mongoIdCheck");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const rr = req.body.expiry;

  let date = new Date(rr);
  const newCoupon = await Coupon.create(req.body);
  res.json({ success: true });
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json(coupons);
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json(updatecoupon);
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const deletecoupon = await Coupon.findByIdAndDelete(id);
  res.status(200).json(deletecoupon);
});

const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const getAcoupon = await Coupon.findById(id);
  res.status(200).json(getAcoupon);
});



module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  
};
