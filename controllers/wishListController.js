const { Product } = require("../models/productModel");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { wishList } = require("../models/wishListModel");
const validateMongoDbId = require("../helper/mongoIdCheck");
const { ObjectId } = require("mongodb");

const asyncHandler = require("express-async-handler");

// add a product to wishlist and check already added
const addToWishlist = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.session.user_id;

    if (!req.session.user_id) {
      return res.json({ success: true, data: "You need to login" });
    }

    const { productId } = req.body;

    const wishlist = await wishList.findOne({
      userId: userId,
    });

    const id = wishlist._id;
    const prods = wishlist.productId;

    if (id) {
      const alreadyadded = prods.find((id) => id.toString() === productId);
      if (!alreadyadded) {
        let newWishlsit = await wishList.findByIdAndUpdate(
          { _id: id },
          {
            $push: { productId: productId },
          }
        );

        return res.json({ success: true, data: "Added Successfully" });
      } else {
        return res.json({ success: true, data: "Already Added" });
      }
    } else {
      const newWishlsit = await wishList.create(req.body);
      return res.json({ success: true, data: "Added Successfully" });
    }
  } catch (err) {
    next(err);
  }
});

const getWishList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const getAwishList = await wishList.findById(id);
  res.status(200).json(getAwishList);
});

//remove item from wishlist
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  // const { id } = req.params;
  // validateMongoDbId(id);

  // const deleteWishLost = await wishList.findByIdAndDelete(id);
  // res.status(200).json(deleteWishLost);

  try {
    const userId = req.session.user_id;

    if (!req.session.user_id) {
      return res.json({ success: true, data: "You need to login" });
    }

    const { productId } = req.body;

    const wishlist = await wishList.findOne({
      userId: userId,
    });

    const id = wishlist._id;
    const prods = wishlist.productId;

    if (id) {
      const alreadyadded = prods.find((id) => id.toString() === productId);
      if (alreadyadded) {
        let newWishlsit = await wishList.findByIdAndUpdate(
          { _id: id },
          {
            $pull: { productId: productId },
          }
        );
        return res.json({ success: true, data: "Removed Successfully" });
      }
    }
  } catch (err) {
    next(err);
  }
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
