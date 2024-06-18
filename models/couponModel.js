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
    startdate: {
      type: Date,
      required: true,
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
// module.exports = mongoose.model("Coupon", couponSchema);
const Coupon = mongoose.model.coupons || mongoose.model("coupon", couponSchema);

const validateCoupon = async (coupon) => {
  console.log(coupon);
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(10)
      .required()
      .trim()
      .pattern(new RegExp("^[A-Z0-9]+$"))
      .messages({
        "string.empty": `Name is a required`,
        "string.pattern.base": "Not a valid code eg:ABC123",
        "string.max": "Length is limited to 10 charactor",
        "string.min": "Minimum Length required 3 charactor",
      }),
    discount: Joi.number().required().min(1).max(100).messages({
      "any.required": "Discount is a required",
      "number.max": "Discount must be less than or equal to 100",
      "number.min": "Discount must be greater than 0",
      "number.base": "Enter a Valid Number",
    }),
    startdate: Joi.date().required().messages({
      "any.empty": `Date is a required field`,
      "date.base": `Date format is not correct`,
    }),
    expiry: Joi.date().required().messages({
      "any.empty": `Date is a required field`,
      "any.required": "End Date is a required",
      "date.base": `Date format is not correct`,
    }),
  });
  const { error, value } = schema.validate(coupon);
  return { error, value };
};

module.exports = { Coupon, validateCoupon };
