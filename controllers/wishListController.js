const { Product } = require("../models/productModel");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { WhishList } = require("../models/WhishListModel");
const validateMongoDbId = require("../helper/mongoIdCheck");

const asyncHandler = require("express-async-handler");

// add a product to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId, userId } = req.body;

  const uerr = validateMongoDbId(userId);

  // const perr = validateMongoDbId(productId);

  if (uerr) {
    return res.status(400).json({ message: "Id is not Valid" });
  }

  //const alreadyadded = .wishlist.find((id) => id.toString() === prodId);

  const newWishlsit = await WhishList.create(req.body);
  return res.json({ success: true });
});

const getWishList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const getAwishList = await WhishList.findById(id);
  res.status(200).json(getAwishList);
});

//remove item from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const deleteWishLost = await WhishList.findByIdAndDelete(id);
  res.status(200).json(deleteWishLost);
});

//get all wishlist of current user
const getAllWishlist = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const wishlists = await WhishList.find({
    userId: id,
  }).populate("productId");
  // const wishlists = await WhishList.find().populate("product");

  // console.log(wishlists);
  res.status(200).json({ data: wishlists, id: id });
});

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getAllWishlist,
};
