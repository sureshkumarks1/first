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

const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // validateMongoDbId(id);

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
};
