const express = require("express");
const coupon_route = express.Router();
const couponController = require("../controllers/couponController");

coupon_route.post("/", couponController.createCoupon);

coupon_route.get("/", couponController.couponHome);
coupon_route.get("/getall", couponController.getAllCoupons);
coupon_route.patch("/", couponController.updateCoupon);
coupon_route.delete("/delete", couponController.deleteCoupon);
coupon_route.get("/:id", couponController.getCoupon);
coupon_route.post("/getCoupon", couponController.getCoupon);

module.exports = coupon_route;
