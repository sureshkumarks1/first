const orderCollection = require("../models/orderModel");
const formatDate = require("../helper/date");
const mongoose = require("mongoose");

const ObjectId = new mongoose.Types.ObjectId();

//admin side order Management

//order list load
const getOrders = async (req, res) => {
  try {
    let orderData = await orderCollection
      .find({})
      .sort({ orderDate: -1 })
      .populate("userId");
    //   .populate("userId addressChosen");

    const orderDataNew = orderData.map((v) => {
      v.orderDateFormatted = formatDate(v.orderDate);
      return v;
    });
    res.json({ data: orderData });
  } catch (error) {
    console.log(error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const rest = await orderCollection.updateOne(
      { _id: req.body.id },
      { orderStatus: req.body.orderStatus }
    );
    if (rest.acknowledged) {
      res.send({ success: true });
    } else res.send({ success: false });
  } catch (err) {
    res.send({ success: false, msg: err });
  }
};

const orderDetailspage = async (req, res) => {
  let orderData = await orderCollection
    .find({ _id: req.params.id })
    .populate("userId")
    .populate("addressChosen");
  res.render("orderDetailsPage", { id: req.params.id, details: orderData });
};

const changeOrderPaymentStatus = async (req, res) => {
  const { ordId, razorpay_payment_id, razorpay_order_id } = req.body;

  const obj = {
    paymentId: razorpay_payment_id,
    paymentOrdId: razorpay_order_id,
    orderStatus: "confirm",
  };

  let orderData = await orderCollection.updateOne({ _id: ordId }, obj);

  //console.log("to change the status", orderData);

  if (orderData.modifiedCount) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
};

module.exports = {
  getOrders,
  orderDetailspage,
  updateStatus,
  changeOrderPaymentStatus,
};
