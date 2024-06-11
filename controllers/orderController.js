
const orderCollection = require("../models/orderModel");
const formatDate = require("../helper/date");


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

  // console.log(orderData);



  res.render("orderDetailsPage", { id: req.params.id, details: orderData });
};

module.exports = { getOrders, orderDetailspage, updateStatus };
