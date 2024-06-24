const { Coupon, validateCoupon } = require("../models/couponModel");
const validateMongoDbId = require("../helper/mongoIdCheck");
const asyncHandler = require("express-async-handler");
const orderCollection = require("../models/orderModel");

const createCoupon = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  const { discount, name } = req.body;
  delete req.body.editId;
  const data = req.body;

  const body = {
    ...data,
    startdate: new Date(req.body.startdate),
    expiry: new Date(req.body.expiry),
  };

  const { error, value } = await validateCoupon(body);
  console.log(error);
  if (error === undefined) {
    try {
      const coupons = await Coupon.findOne({ name: name }).select("name");
      console.log("====", coupons);

      if (coupons) {
        if (coupons?.name == name) {
          let message = {};
          const error = {
            details: [],
          };
          message["message"] = "This coupon name already in use";
          message["path"] = ["name"];
          error.details.push(message);
          console.log(error);

          return res.json({ success: false, data: error.details });
        }
      } else {
        let message = {};
        const error = {
          details: [],
        };
        message["message"] = "";
        message["path"] = [""];
        error.details.push(message);
        const newCoupon = await Coupon.create(req.body);
        return res.json({ success: true, data: newCoupon });
        // return res.json({ success: false, data: error.details });
      }

      // return res.json({ success: true, data: error.details });
    } catch (err) {
      next(err);

      // console.log("==========>", err.code);
    }
  } else {
    return res.json({ success: false, data: error.details });
  }

  // res.json({ success: true });
});

const couponHome = (req, res, next) => {
  res.render("coupons");
};

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json(coupons);
});

const updateCoupon = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { editId } = req.body;

  delete req.body.editId;

  const { error, value } = await validateCoupon(req.body);

  if (error === undefined) {
    const updatecoupon = await Coupon.findByIdAndUpdate(editId, req.body);
    return res.status(200).json({ data: updatecoupon, success: true });
  } else {
    return res.json({ success: false, data: error.details });
  }
});

const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  console.log("The id is :", id);
  /*
  const orders = await orderCollection
    .find({
      couponId: id,
    })
    .populate("coupon");
*/
  // res.status(200).json({ success: true, id: id, orders: orders });
});

const checkCoupon = async (req, res, next) => {
  console.log(req.body);
  const { code } = req.body;
  const checkDate = new Date();

  try {
    const coupon = await Coupon.findOne({ name: code.trim() });

    if (!coupon) {
      return res.status(200).json({ success: false, data: "Invalid Coupon" });
    }

    const checkDate = new Date();
    console.log("checkDate =>>>>>>>>", checkDate);
    const startDate = new Date(coupon?.startdate);
    console.log("startDate =>>>>>>>>", startDate);
    const endDate = new Date(coupon?.expiry);
    console.log("endDate =>>>>>>>>", endDate);
    if (checkDate >= startDate && checkDate <= endDate) {
      // console.log("startDate =>>>>>>>>", coupon.discount);
      let total = req.session.grandTotal;
      //1600 = 1600 = (1600*12/100)
      total = total - total * (20 / 100);
      req.session.couponTotal = total;
      return res.status(200).json({
        success: true,
        data: total,
        discount: coupon.discount,
        // couponId: coupon._id,
      });
      console.log("===========", total);
    } else {
      // console.log("The check date is not between the start and end dates.");
    }
  } catch (error) {
    next(error);
    //console.log(error);
  }
};

const getCoupon = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { id } = req.body;
  // validateMongoDbId(id);
  // res.status(200).json({ success: true });

  const getAcoupon = await Coupon.findById(id);
  console.log(getAcoupon);
  res.status(200).json(getAcoupon);
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  couponHome,
  checkCoupon,
};
