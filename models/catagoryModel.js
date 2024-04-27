const mongoose = require('mongoose')
require('../db/mongo')
const Joi = require('joi')

const catagorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
      },
    status:{
        type:Boolean,
        required:true,
        default:true
    }
},{ timestamps: true })

async function validateCat(Cat){

    const schema = Joi.object({
      name:Joi.string().min(3).required(),  
      
    })    
  
    try {
      let value = '';
       value = await schema.validateAsync(Cat);
      return true;
  }
  catch (err) {
    return err.message
   }
  
  }


const Catagory = new mongoose.model('Catagory', catagorySchema)

module.exports = {Catagory, validateCat}