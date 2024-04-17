const {User,  validateUser  } = require("../models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const url = require('url');    

const { sendEmail } = require('../services/sendEmail')





//console.log(app.locals.age)
// converting user password to hashed password
const securePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10)
    
    const passwordHash = await bcrypt.hash(password, salt);

    return passwordHash;

  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("registration", {layout:"../layouts/login/register",title:"register"});
  } catch (error) {
    console.log(error.message);
  }
};


const verifyOTP = (req, res) => {
  // res.render("verification", {title:"VerifyOTP"});
  // console.log(req.body)
  const {otp} = req.body;

  res.status(200).send({"otp":otp,"message":"success"}).json()

}

// create a new user 

const insertUser = async (req, res) => {
  try {

    const {name, email, password} = req.body

    if(name!== "" && email!=="" && password!==""){
      const checkmail =  sendEmail(email)

      req.session.otp = checkmail

      if(req.session.otp){
          //console.log("mail send")
          res.status(200).send({"url":"http://127.0.0.1:3000/verify","message":"success"}).json()
      }
    //const result = new Promise(resolve=>{

      //res.status(200).send({"url":"http://127.0.0.1:3000/verify","message":"success"}).json()

   // })
  }else{
    const result = new Promise(reject=>{
      res.status(404).send({"message":"failure"}).json()
    })
  }
    //res.redirect("verification")

    return;

    const errors = await validateUser(req.body);

    if(typeof errors !== 'object'){      
      res.send(errors)
    }
    // }else {
    //   res.send({"succrss":"working"})

    // }

    // if (!errors.isEmpty()) {
    //   //res.render("registration", { errors:errors.array()[0].msg, old:{email,mobile,name} });
      
    //       } 
          else {

            const spassword = await securePassword(password);
            const user = new User({      
            name,
            email,            
            password: spassword,
            role: 'user',
            create : new Date()
          });

          const userData = await user.save();

          // if (userData) {
          //   res.render("registration", { message: "Registration Successfull" });
          // } else res.render("registration", { message: "Registration failed" });
          if (userData) {
            res.send({ message: "Registration Successfull" });
          } else res.send({ message: "Registration failed" });
        
        }
  }catch (error) {
    console.log(error.message);
    }
  
};

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    
     const {email, password} = req.body;
     
     
     const errors = validationResult(req.body);
     if (errors.isEmpty()) {    
       const userData = await User.findOne({ email, role:'user' });       
      if (userData) {
              
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        req.session.user_id = userData._id;
        req.session.uname = userData.name

        res.redirect("/");

        //console.log(userData)

        // res.redirect("/home",{username:userData.name});       
         

      } else {
        res.render("login", { errors: "incorrect Username/Password" });
      }
    } else {
      res.render("login", { errors: "incorrect Username/Password" });      
    }

  }else{

    res.render("login", { errors: errors.array()[0].msg, old:{
      email:email
    } });
  }
  

  } catch (error) {
    console.log(error.message); 
  }
};
const loadHome = async (req, res) => {
  try {
    let word = "guest";

    if(req.session.uname){
      word = req.session.uname
    }
    const capitalized = word.charAt(0).toUpperCase()+ word.slice(1)
    
    res.render("home", {name:capitalized});

  } catch (error) {
    console.log(error.message);
  }
};
 
const userLogout = async (req,res) => {

  try {
    req.session.destroy();
    res.redirect("/");
  }
  catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  verifyOTP
};
