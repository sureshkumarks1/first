const mongoose = require("mongoose");
require("../db/mongo");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    // mobile:{
    //   type:String,
    //   required:true
    // },
    password: {
      type: String,
      required: true,
    },
    wallet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wallet",
      },
    ],
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

async function validateUser(User) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  try {
    let value = "";
    value = await schema.validateAsync(User);
    return value;
  } catch (err) {
    return err.message;
  }
}

module.exports = { User, validateUser };
