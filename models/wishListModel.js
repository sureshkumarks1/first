const mongoose = require("mongoose");
require("../db/mongo");

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    productId: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "product",
      },
    ],
  },
  { timestamps: true }
);

const wishList = mongoose.model("wishlist", wishlistSchema);

module.exports = { wishList };
