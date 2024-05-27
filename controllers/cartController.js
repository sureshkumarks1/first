const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { Product } = require("../models/productModel");
const profileCollection = require("../models/addressModel.js");
const cartCollection = require("../models/cartModel.js");
const ObjectId = require("mongodb").ObjectId;

const orderCollection = require("../models/orderModel.js");

async function grandTotal(req) {
  try {
    let userCartData = await cartCollection
      .find({ userId: req.session.user_id })
      .populate("productId");

    // console.log("The value of userData", userCartData);

    let grandTotal = 0;
    for (const eachitem of userCartData) {
      grandTotal += eachitem.productId.price * eachitem.productQuantity;

      // console.log("The price is : ", eachitem.productId.price);

      await cartCollection.updateOne(
        { _id: eachitem._id },
        {
          $set: {
            totalCostPerProduct:
              eachitem.productId.price * eachitem.productQuantity,
          },
        }
      );
    }

    userCartData = await cartCollection
      .find({ userId: req.session.user_id })
      .populate("productId");

    req.session.grandTotal = grandTotal;

    // console.log("These are the cart value", userCartData);

    return JSON.parse(JSON.stringify(userCartData));
  } catch (error) {
    console.log(error);
  }
}
const cart = async (req, res) => {
  try {
    let userCartData = await grandTotal(req);

    //console.log(userCartData);

    res.render("cart", {
      signIn: req.session.signIn,
      user: req.body.user,
      name: req.body.user,
      currentUser: req.session.currentUser,
      userCartData,
      grandTotal: req.session.grandTotal,
    });
  } catch (error) {
    console.error("Error in cart:", error);
    // res.status(500).send("Internal Server Error");
    // res.redirect('/loginpage')
  }
};

const addToCart = async (req, res) => {
  console.log(req.session.user_id);

  try {
    let existingProduct = await cartCollection.findOne({
      userId: req.session.user_id,
      productId: req.params.id,
    });

    if (existingProduct) {
      await cartCollection.updateOne(
        { _id: existingProduct._id },
        { $inc: { productQuantity: 1 } }
      );
    } else {
      await cartCollection.create({
        userId: req.session.user_id,
        productId: req.params.id,
        productQuantity: 1,
        currentUser: req.session.currentUser,
        user: req.session.uname,
      });
    }

    //res.redirect("/cart");
    // res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteFromCart = async (req, res) => {
  try {
    await cartCollection.findOneAndDelete({ _id: req.params.id });
    res.send("hello ur cart is deleted");
  } catch (error) {
    console.error(error);
  }
};
const decQty = async (req, res) => {
  try {
    let cartProduct = await cartCollection
      .findOne({ _id: req.params.id })
      .populate("productId");
    if (cartProduct.productQuantity > 1) {
      cartProduct.productQuantity--;
    }
    cartProduct = await cartProduct.save();
    await grandTotal(req);
    res.json({
      success: true,
      cartProduct,
      grandTotal: req.session.grandTotal,
      currentUser: req.session.currentUser,
      user: req.body.user,
    });
  } catch (error) {
    console.error(error);
  }
};
const incQty = async (req, res) => {
  try {
    let cartProduct = await cartCollection
      .findOne({ _id: req.params.id })
      .populate("productId");

    if (cartProduct.productQuantity < cartProduct.productId.stock) {
      cartProduct.productQuantity++;
    } else {
      res.json({ message: "Limit Exceeded" });
    }

    cartProduct = await cartProduct.save();
    await grandTotal(req);
    res.json({
      success: true,
      cartProduct,
      grandTotal: req.session.grandTotal,
      currentUser: req.session.currentUser,
      user: req.body.user,
    });
  } catch (error) {
    console.error(error);
  }
};

const checkoutPage = async (req, res) => {
  // console.log(req.params.id);

  try {
    let cartData = await cartCollection
      .find({ userId: req.session.user_id, productId: req.params.id })
      .populate("productId");
    let addressData = await profileCollection.find({
      userId: req.session.user_id,
    });

    if (addressData.length > 0) {
      let userCartData = await grandTotal(req);

      res.render("checkoutPage", {
        signIn: req.session.signIn,
        user: req.body.user,
        name: req.body.user,
        currentUser: req.session.currentUser,
        grandTotal: req.session.grandTotal,
        userCartData,
        cartData,
        addressData: req.session.addressData,
        addressData,
      });
    } else {
      req.session.addressPageFrom = "cart";
      // res.render("checkoutPage");
    }
  } catch (error) {
    res.redirect("/cart");
  }
};

const orderPlaced = async (req, res) => {
  try {
    //incase of COD

    /*await orderCollection.updateOne(
      { _id: req.session.currentOrder._id },
      {
        $set: {
          paymentId: "generatedAtDelivery",
          paymentType: "COD",
        },
      }
    );*/

    res.send({ success: true });
  } catch (error) {
    console.error(error);
  }
};

const orderPlacedEnd = async (req, res) => {
  let cartData = await cartCollection
    .find({ userId: req.session.user_id })
    .populate("productId");

  const dataObj = {
    userId: req.session.user_id,
    orderNumber: (await orderCollection.countDocuments()) + 1,
    orderDate: new Date(),
    addressChosen: new ObjectId(req.params.id),
    cartData: await grandTotal(req),
    grandTotalCost: req.session.grandTotal,
    paymentType: req.params.pm,
  };

  // console.log(dataObj);

  const odresult = await orderCollection.create(dataObj);

  console.log(odresult);

  // req.session.currentOrder = await orderCollection.create({
  //   userId: req.session.user_id,
  //   orderNumber: (await orderCollection.countDocuments()) + 1,
  //   orderDate: new Date(),
  //   addressChosen: ObjectId(req.params.id),
  //   cartData: await grandTotal(req),
  //   grandTotalCost: req.session.grandTotal,
  //   paymentType: req.params.pm
  // });

  /*
  for (const item of cartData) {
    item.productId.productStock -= item.productQuantity; // we use for reducing Qyantity
    item.productId.stockSold += 1; //stocjSolf ++
    await item.productId.save();
  }
*/
  // let orderData = await orderCollection.findOne({
  //   _id: req.session.currentOrder._id,
  // });

  /*
  if (orderData.paymentType == "toBeChosen") {
    orderData.paymentType = "COD";
    orderData.save();
  }
  
  let x = await cartCollection
    .findByIdAndUpdate({ _id: req.session.currentOrder._id })
    .populate("productId");*/

  res.render("orderPlaced", {
    signIn: req.session.signIn,
    user: req.session.user,
    name: req.session.user,
    ordId: odresult._id,
    orderCartData: cartData,
    orderData: req.session.currentOrder,
  });
  //delete product from cart since the order is placed
  await cartCollection.deleteMany({ userId: req.session.user_id });
};

module.exports = {
  cart,
  addToCart,
  deleteFromCart,
  decQty,
  incQty,
  checkoutPage,
  orderPlaced,
  orderPlacedEnd,
};
