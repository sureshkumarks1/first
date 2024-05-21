const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const addressCollection = require("../models/addressModel");
const orderCollection = require("../models/orderModel");
const formatDate = require("../services/formatDateHelper");

module.exports = {
  accountPage: async (req, res) => {
    try {
      let userData = await User.find({
        _id: req.session.user_id,
      });

      const addressData = await addressCollection.find({
        userId: req.session.user_id,
      });

      res.render("profile", {
        currentUser: req.session.currentUser,
        name: req.session.currentUser,
        userData,
        addressData,
        userId: req.session.user_id,
      });
    } catch (error) {
      console.error(error);
    }
  },

  myAddress: async (req, res) => {
    try {
      const addressData = await addressCollection.find({
        userId: req.session.user_id,
      });
      res.render("users/myAddress", {
        currentUser: req.session.currentUser,
        addressData,
      });
    } catch (error) {
      console.error(error);
    }
  },

  singleAddress: async (req, res) => {
    try {
      const addressData = await addressCollection.find({
        _id: req.params.id,
        userId: req.session.user_id,
      });
      res.json({ data: addressData });
      // console.log(addressData);
    } catch (error) {
      console.error(error);
    }
  },

  addAddressPost: async (req, res) => {
    // console.log(req.body);

    try {
      const address = {
        userId: req.session.user_id,
        addressTitle: req.body.addressTitle,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        phone: req.body.phone,
        state: req.body.state,
      };

      const result = await addressCollection.insertMany([address]);
      if (!result) res.send({ success: false });
      else res.send({ success: true });
    } catch (error) {
      console.error(error);
    }
  },

  editAddressPost: async (req, res) => {
    try {
      const address = {
        addressTitle: req.body.addressTitle,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        phone: req.body.phone,
      };

      await addressCollection.updateOne({ _id: req.body.id }, address);

      res.send({ success: true });
    } catch (error) {
      console.error(error);
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const result = await addressCollection.deleteOne({ _id: req.params.id });
      // const result = true;
      if (!result) res.send({ success: false });
      else res.send({ success: true });
    } catch (error) {
      console.log(error);
    }
  },

  changePassword: async (req, res) => {
    try {
      res.render("users/changePassword", {
        invalidCurrentPassword: req.session.invalidCurrentPassword,
        currentUser: req.session.currentUser,
      });
    } catch (error) {
      console.error(error);
    }
  },

  changePasswordPatch: async (req, res) => {
    console.log("hi i am from password change", req.session.currentUser);

    const cpassword = await User.findOne({
      _id: req.body.userId,
    }).select("password");
    // console.log("The current password", cpassword);

    try {
      const compareCurrentPass = bcrypt.compareSync(
        req.body.currentPassword,
        cpassword.password
      );

      if (compareCurrentPass) {
        const encryptedNewPassword = bcrypt.hashSync(req.body.confirmPass, 10);
        await User.updateOne(
          { _id: req.session.user_id },
          { $set: { password: encryptedNewPassword } }
        );
        // req.session.currentPassword=await User.find({_id: req.session.user_id})
        res.json({ success: true });
      } else {
        req.session.invalidCurrentPassword = true;
        res.json({ success: false, message: "password not correct" });
      }
    } catch (error) {
      console.error(error);
    }
  },

  orderHistory: async (req, res) => {
    try {
      let orderData = await orderCollection.find({
        userId: req.session.user_id,
      });
      orderData = orderData.filter(
        (order) => order.paymentType !== "toBeChosen"
      );

      orderData = orderData.map((v) => {
        v.orderDateFormatted = formatDate(v.orderDate);
        return v;
      });

      res.render("orderHistory", {
        currentUser: req.session.currentUser,
        orderData,
      });
    } catch (error) {
      console.error(error);
    }
  },
  orderStatus: async (req, res) => {
    try {
      let orderData = await orderCollection
        .findOne({ _id: req.params.id })
        .populate("addressChosen");
      let isCancelled = orderData.orderStatus == "Cancelled" ? true : false;
      let isReturn = orderData.orderStatus == "Return" ? true : false;
      res.render("users/orderStatus", {
        currentUser: req.session.currentUser,
        orderData,
        isCancelled,
        isReturn,
      });
    } catch (error) {
      console.error(error);
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const { cancelReason } = req.body;

      const orderData = await orderCollection.findOne({ _id: req.params.id });

      await orderCollection.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { orderStatus: "Cancelled", cancelReason } }
      );

      let walletTransaction = {
        transactionDate: new Date(),
        transactionAmount: orderData.grandTotalCost,
        transactionType: "Refund from cancelled Order",
      };

      await walletCollection.findOneAndUpdate(
        { userId: req.session.user_id },
        {
          $inc: { walletBalance: orderData.grandTotalCost },
          $push: { walletTransaction },
        }
      );

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  returnRequest: async (req, res) => {
    try {
      const { ReturnReason } = req.body;

      const orderData = await orderCollection.findOne({ _id: req.params.id });

      await orderCollection.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { orderStatus: "Return", ReturnReason } }
      );

      let walletTransaction = {
        transactionDate: new Date(),
        transactionAmount: orderData.grandTotalCost,
        transactionType: "Refund from cancelled Order",
      };

      await walletCollection.findOneAndUpdate(
        { userId: req.session.user_id },
        {
          $inc: { walletBalance: orderData.grandTotalCost },
          $push: { walletTransaction },
        }
      );

      res.json({ success: true });
    } catch (error) {
      console.error(error);
    }
  },
};
