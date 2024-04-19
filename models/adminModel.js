const mongoose = require('mongoose')
require('../db/mongo')
const Joi = require('joi')



const adminSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        maxlength:255
    },
    email:{
    type:String,
    unique:true,
    required:true
  },
  // mobile:{
  //   type:String,
  //   required:true
  // },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  }

});

const Admin = mongoose.model("admins",adminSchema)

async function validateUser(Admin){
  const schema = Joi.object({
    name:Joi.string().min(3).required(),
    email:Joi.string().required(),
    password:Joi.string().min(6).max(1024).required(),
    status:Joi.string().required()
  })
  

  try {
    let value = '';
     value = await schema.validateAsync(Admin);
    return value;
}
catch (err) {
  return err.message
 }

}

module.exports = { Admin , validateUser };
