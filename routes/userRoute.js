const express = require("express");
const path = require('path')
const user_route = express();
const session = require("express-session");
require('dotenv').config()
const nocache = require("nocache");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


const cors = require('cors')

const { body } = require('express-validator');

user_route.use(bodyParser.json());
user_route.use(cookieParser())
user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));
// user_route.set('/public', path.join(__dirname,'/public'))

user_route.use(nocache());

user_route.use(cors())

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

user_route.use(express.static("public"));

user_route.set('/nodefile', path.join(__dirname,'/node_modules'))


user_route.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized:false
}));

// user_route.get("/register", auth.isLogout,userController.loadRegister);
user_route.get("/register",  userController.loadRegister);
//user_route.post("/register",body('email').isEmail().withMessage('Please Enter a valid Email address'),body('password').isLength({min:5}).withMessage('Please enter the password'),body('mobile').isLength({min:10}).withMessage("Enter 10 Digit Mobile Number"), userController.insertUser);
//user_route.post("/register",body('email').isEmail().withMessage('Please Enter a valid Email address'), userController.insertUser);

user_route.post("/register", userController.checkvalues)

user_route.post("/insert", userController.insertUser)




user_route.post("/verifyotp", userController.verifyOTP)

// user_route.get("/register", (req, res)=>{
//  res.send({message:"working"})
// })

//user_route.get("/" , auth.isLogout, userController.loginLoad);

user_route.get("/", userController.loadHome);

//user_route.get("/home",  userController.loadHome);

user_route.get("/login" , auth.isLogout , userController.loginLoad); 
// user_route.get("/login" , auth.isLogin, userController.loadHome); 

//user_route.get("/login" , auth.isLogout, userController.loginLoad); 

user_route.post("/login",body('email').isEmail().withMessage('Please Enter a valid Email address'),body('password').isLength({min:5}).withMessage('Please enter the password'), userController.verifyLogin);

//user_route.get("/home", auth.isLogin,userController.loadHome);
// user_route.get("/home", userController.loadHome);
//user_route.get("/home", userController.loadHome);

user_route.get("/logout",  userController.userLogout)
user_route.get("/product-details",  userController.productDetails)
// user_route.get("/logout",  userController.userLogout)

// user_route.get("/*", userController.notfound)


module.exports = user_route;
