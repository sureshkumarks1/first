const mongoose = require('mongoose')
require('../db/mongo')
const Joi = require('joi')

const catagorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
      },
    status:{
        type:String,
        required:true,
        default:1
    }
})

const Catagory = new mongoose.model('Catagory', catagorySchema)

module.exports = {Catagory}