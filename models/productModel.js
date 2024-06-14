const mongoose = require("mongoose");
require("../db/mongo");
const Joi = require("joi");
const { Catagory } = require("../models/catagoryModel");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
        default: "",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Catagory",
    },
    tags: String,
    ratings: [
      {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    totalrating: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

async function validateProd(Products) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  try {
    let value = "";
    value = await schema.validateAsync(Products);
    return value;
  } catch (err) {
    return err.message;
  }
}

const Product = new mongoose.model("product", productSchema);

module.exports = { Product, validateProd };
