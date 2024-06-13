const mongoose = require("mongoose"); // Erase if already required
const Joi = require("joi");

// Declare the Schema of the Mongo model
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
// const Coupon = mongoose.model("coupon", couponSchema);

const validateCoupon = (Coupon) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(500).required().messages({
      "string.empty": `Name is a required field`,
    }),
    expiry: Joi.date().required().messages({
      "any.empty": `Date is a required field`,
    }),
    discount: Joi.number().min(1).max(99).required(),
  });
  const { error, value } = schema.validate(Coupon);
  return { error, value };
};

// module.exports = { coupon };
