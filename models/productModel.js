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
    offer: {
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

async function countProduct() {}
const productValidationSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": "Minimum Length required 3 charactor",
    "any.empty": `Name is a required field`,
  }),
  category: Joi.string().required().messages({
    "any.empty": `Category is a required field`,
  }),
  description: Joi.string().min(1).required().messages({
    "string.min": "Minimum Length required 3 charactor",
    "any.empty": `Name is a required field`,
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Cannot set negative value for price",
    "any.empty": `Price is a required field`,
  }),
  stock: Joi.number().min(0).required().messages({
    "number.min": "Cannot set negative value for price",
    "any.empty": `Stock is a required field`,
  }),
  offer: Joi.number().min(0).required().messages({
    "number.min": "Cannot set negative value for offer",
    "any.empty": `Offer is a required field`,
  }),
});
const validateProduct = (product) => {
  return productValidationSchema.validate(product, { abortEarly: false });
};
/*
async function validateProd(Products) {
  const schema = Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.min": "Minimum Length required 3 charactor",
      "any.empty": `Name is a required field`,
    }),
    category: Joi.string().required().messages({
      "any.empty": `Category is a required field`,
    }),
    description: Joi.string().min(1).required().messages({
      "string.min": "Minimum Length required 3 charactor",
      "any.empty": `Name is a required field`,
    }),
    price: Joi.number().min(0).required().messages({
      "number.min": "Cannot set negative value for price",
      "any.empty": `Price is a required field`,
    }),
    stock: Joi.number().min(0).required().messages({
      "number.min": "Cannot set negative value for price",
      "any.empty": `Stock is a required field`,
    }),
  });

  try {
    return schema.validate(Products);
  } catch (error) {
    next(error);
    // Catch and handle validation errors
    // if (error.isJoi) {
    //   console.error("Validation error:", error.details);
    // } else {
    //   console.error("Unexpected error:", error);
    // }
  }
}*/

const Product = new mongoose.model("product", productSchema);

module.exports = { Product, validateProduct };
