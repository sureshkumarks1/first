const { Product } = require("../models/productModel");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { wishList } = require("../models/wishListModel");
const validateMongoDbId = require("../helper/mongoIdCheck");
const { ObjectId } = require("mongodb");

const asyncHandler = require("express-async-handler");

// add a product to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.session.user_id;
  const { productId } = req.body;
  // console.log(typeof productId);
  // console.log("user id :", userId);

  if (userId === undefined) {
    // console.log("no user");
  }

  // console.log(req.body);

  const wishlist = await wishList.find({ userId: userId });
  // console.log(wishlist);
  const _id = wishlist[0]._id;
  const prods = wishlist[0].productId;
  console.log("the id is :", prods);

  const alreadyadded = prods.find((id) => id.toString() === productId);
  // console.log("This is >>>>>>", alreadyadded);

  if (alreadyadded) {
    // if (wishlist[0].productId.length > 0) {
    let newWishlsit = await wishList.findByIdAndUpdate(
      _id,
      {
        $push: { productId: productId },
      },
      {
        new: true,
      }
    );
  } else {
    const newWishlsit = await wishList.create(req.body);
  }

  // const newWishlsit = await wishList.create(req.body);
  return res.json({ success: true, data: wishlist });
});

const getWishList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const getAwishList = await wishList.findById(id);
  res.status(200).json(getAwishList);
});

//remove item from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const deleteWishLost = await wishList.findByIdAndDelete(id);
  res.status(200).json(deleteWishLost);
});

//get all wishlist of current user
const getAllWishlist = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const wishlists = await wishList
    .find({
      userId: id,
    })
    .populate("productId");
  // const wishlists = await wishList.find().populate("product");

  // console.log(wishlists);
  res.status(200).json({ data: wishlists, id: id });
});

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getAllWishlist,
};
