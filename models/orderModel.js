const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "users",
    },
    orderNumber: { type: Number, required: true },
    orderDate: {
      type: Date,
      required: true,
      default: function () {
        // Get current date and format it to 'YYYY-MM-DD'
        return new Date().toISOString().slice(0, 10);
      },
    },

    orderStatus: { type: String, default: "Placed" },
    addressChosen: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "addresses",
    },
    cartData: { type: Array },
    grandTotalCost: { type: Number },
    paymentType: { type: String, default: "toBeChosen" },
    paymentId: { type: String, default: "" },
    paymentOrdId: { type: String, default: "" },
  },
  { timestamps: true }
);

const orderCollection = mongoose.model("orders", orderSchema);

module.exports = orderCollection;
