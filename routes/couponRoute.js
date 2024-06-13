const express = require("express");
const coupon_route = express.Router();
const couponController = require("../controllers/couponController");

coupon_route.post("/", couponController.createCoupon);

coupon_route.get("/", couponController.getAllCoupons);
coupon_route.patch("/:id", couponController.updateCoupon);
coupon_route.delete("/:id", couponController.deleteCoupon);
coupon_route.get("/:id", couponController.getCoupon);

module.exports = coupon_route;
