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
        userId: req.session?.user_id,
      });

      res.render("profile", {
        currentUser: req.session?.currentUser,
        name: req.session?.currentUser,
        userData,
        addressData,
        userId: req.session?.user_id,
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
    //console.log(req.body);

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

  getPassword: async (req, res) => {
    try {
      //console.log(req.body.password);

      const cpassword = await User.findOne({
        _id: req.session.user_id,
      }).select("password");

      // console.log(req.session.currentUser);

      const compareCurrentPass = bcrypt.compareSync(
        req.body.password,
        cpassword.password
      );

      //console.log(compareCurrentPass);

      res.json({ success: compareCurrentPass });
    } catch (error) {
      console.error(error);
    }
  },

  changePassword: async (req, res) => {
    try {
      const cpassword = await User.findOne({
        _id: req.session.user_id,
      }).select("password");

      res.render("changePassword", {
        currentPassword: cpassword,
        currentUser: req.session.currentUser,
        name: req.session.currentUser.name,
      });
    } catch (error) {
      console.error(error);
    }
  },

  changePasswordPatch: async (req, res) => {
    const cpassword = await User.findOne({
      _id: req.body.userId,
    }).select("password");
    // console.log("The current password", cpassword);

    try {
      const compareCurrentPass = bcrypt.compareSync(
        req.body.password,
        cpassword.password
      );

      if (compareCurrentPass) {
        const encryptedNewPassword = bcrypt.hashSync(req.body.password, 10);
        await User.updateOne(
          { _id: req.session.user_id },
          { $set: { password: encryptedNewPassword } }
        );
        req.session.currentPassword = await User.find({
          _id: req.session.user_id,
        });
        res.json({ success: true });
      } else {
        req.session.invalidCurrentPassword = true;
        res.json({ success: false, message: "password not correct" });
      }
    } catch (error) {
      console.error(error);
    }
  },

  chgresetpass: async (req, res) => {
    try {
      const encryptedNewPassword = bcrypt.hashSync(req.body.password, 10);
      await User.updateOne(
        { email: req.session.email },
        { $set: { password: encryptedNewPassword } }
      );

      res.json({ success: true });
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

      orderData = orderData.map((ordata) => {
        ordata.orderDateFormatted = formatDate(ordata.orderDate);
        return ordata;
      });

      res.render("orderHistory", {
        currentUser: req.session.currentUser,
        name: req.session?.currentUser?.name,
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
      const result = await orderCollection.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { orderStatus: "Cancelled" } }
      );

      res.send({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      let orderData = await orderCollection
        .find({
          _id: req.params.id,
          userId: req.session.user_id,
        })
        .populate("addressChosen");
      res.send({ data: orderData });
      console.log(orderData);
    } catch (error) {
      console.error(error);
    }
  },
};
