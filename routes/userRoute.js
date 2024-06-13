const express = require("express");
const path = require("path");
const user_route = express();
const session = require("express-session");
require("dotenv").config();
const nocache = require("nocache");
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController.js");
const profileController = require("../controllers/profileController.js");
const productController = require("../controllers/productController.js");
const orderController = require("../controllers/orderController.js");
const wishListController = require("../controllers/wishListController.js");

const auth = require("../middleware/auth");
// const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const blockedUserCheck = require("../middleware/blockUserCheck.js");

const cors = require("cors");

const { body } = require("express-validator");

//user_route.use(bodyParser.json());

user_route.use(cookieParser());

user_route.use(express.json());

user_route.use(express.urlencoded({ extended: true }));

// user_route.set('/public', path.join(__dirname,'/public'))

user_route.use(nocache());

user_route.use(cors());

user_route.set("view engine", "ejs");

user_route.set("views", "./views/users");

user_route.use(express.static("public"));

user_route.set("/nodefile", path.join(__dirname, "/node_modules"));

user_route.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

// user_route.get("/register", auth.isLogout,userController.loadRegister);
user_route.get("/register", userController.loadRegister);
user_route.get("/resetpasswd", userController.resetpasswd);

//user_route.post("/register",body('email').isEmail().withMessage('Please Enter a valid Email address'),body('password').isLength({min:5}).withMessage('Please enter the password'),body('mobile').isLength({min:10}).withMessage("Enter 10 Digit Mobile Number"), userController.insertUser);
//user_route.post("/register",body('email').isEmail().withMessage('Please Enter a valid Email address'), userController.insertUser);

user_route.post("/register", userController.checkvalues);

user_route.post("/insert", userController.insertUser);

user_route.post("/verifyotp", userController.verifyOTP);

user_route.post(
  "/verifyOtpResetPassword",
  userController.verifyOtpResetPassword
);

// user_route.get("/register", (req, res)=>{
//  res.send({message:"working"})
// })

//user_route.get("/" , auth.isLogout, userController.loginLoad);

// user_route.get("/", userController.loadHome);

//user_route.get("/home",  userController.loadHome);

user_route.get("/login", auth.isLogout, userController.loginLoad);
user_route.get(
  "/verifyotppassword",
  auth.isLogout,
  userController.verifyOtpPassword
);

user_route.get(
  "/profile/fogotPassword",
  auth.isLogout,
  userController.forgotPassword
);
user_route.post(
  "/otpfogotPassword",
  auth.isLogout,
  userController.otpForgotPassword
);

user_route.post(
  "/profile/fogotPassword",
  auth.isLogout,
  userController.sendOtp
);
// user_route.get("/login" , auth.isLogin, userController.loadHome);

//user_route.get("/login" , auth.isLogout, userController.loginLoad);

user_route.post("/login", auth.isLogout, userController.verifyLogin);

user_route.get("/googleLogin", userController.googleLogin);

//user_route.get("/home", auth.isLogin,userController.loadHome);
// user_route.get("/home", userController.loadHome);
//user_route.get("/home", userController.loadHome);

user_route.get("/logout", auth.isLogin, userController.userLogout);
user_route.get("/", productController.productPage);
user_route.get("/products", productController.productPage);
user_route.post(
  "/products/range",
  productController.getAllPorductsByPriceRange
);
user_route.get("/product-details/:id", userController.productDetails);

/*==================cart route starts here=======================*/
// user_route.get("/cart", auth.isLogin, blockedUserCheck, cartController.cart);
user_route.get("/cart", cartController.cart);

user_route.post("/product/test", auth.isLogin, cartController.addToCart);

user_route.post(
  "/cart/:id",
  auth.isLogin,
  blockedUserCheck,
  cartController.addToCart
);
user_route.delete(
  "/cart/delete/:id",
  auth.isLogin,
  blockedUserCheck,
  cartController.deleteFromCart
);
user_route.put(
  "/cart/decQty/:id",
  auth.isLogin,
  blockedUserCheck,
  cartController.decQty
);
user_route.put(
  "/cart/incQty/:id",
  auth.isLogin,
  blockedUserCheck,
  cartController.incQty
);
/*==================cart route ends here=======================*/

/*========================user profile code starts here=============================== */
// user_route.get("/profile", auth.isLogin, userController.loginLoad);
user_route.get("/profile", auth.isLogin, profileController.accountPage);

user_route.get(
  "/profile/chgpass",
  auth.isLogin,
  profileController.changePassword
);

user_route.patch(
  "/profile/chgpass",
  auth.isLogin,
  profileController.changePasswordPatch
);

user_route.patch(
  "/profile/chgresetpass",

  profileController.chgresetpass
);
user_route.post(
  "/profile/getPassword",
  auth.isLogin,
  profileController.getPassword
);

user_route.get(
  "/profile/orderhistory",
  auth.isLogin,
  profileController.orderHistory
);
user_route.post(
  "/profile/addAddress",
  auth.isLogin,
  profileController.addAddressPost
);
/*========================user profile code ends here=============================== */

user_route.get("/profile/getaddress/:id", profileController.singleAddress);
user_route.get("/profile/deladdress/:id", profileController.deleteAddress);
user_route.get("/profile/wishlist", auth.isLogin, profileController.myWishList);
user_route.post("/profile/editAddress", profileController.editAddressPost);

/****************cart section*****************/
user_route.get("/checkout/:id", auth.isLogin, cartController.checkoutPage);
user_route.post("/orderplaced", auth.isLogin, cartController.orderPlaced);
user_route.post("/payment", auth.isLogin, cartController.orderPlacedEnd);
user_route.patch(
  "/chgpaymtsts",
  auth.isLogin,
  orderController.changeOrderPaymentStatus
);

user_route.post("/verify-payment", auth.isLogin, cartController.verifyPayment);

user_route.get(
  "/orderplacedend/:oid/:pm",
  auth.isLogin,
  cartController.orderPlacedEnd
);
user_route.put("/cancelorder/:id", auth.isLogin, profileController.cancelOrder);
user_route.get(
  "/order/getorderdetails/:id",
  auth.isLogin,
  profileController.getOrderDetails
);
/****************cart section*****************/

// user_route.get("/*", userController.notfound);

/**** not found***** */
user_route.get("/404", userController.loadNotFound);
user_route.post("/addtowishlist", wishListController.addToWishlist);
user_route.get("/getallwishlist/:id", wishListController.getAllWishlist);
user_route.delete(
  "/removefromwishlist/:id",
  wishListController.removeFromWishlist
);

/**** not found***** */

module.exports = user_route;
