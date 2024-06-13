const { User, validateUser } = require("../models/userModel");
const profileController = require("../controllers/profileController.js");
const { Product } = require("../models/productModel");
const { Catagory } = require("../models/catagoryModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const url = require("url");
const productController = require("../controllers/productController.js");
const { sendEmail } = require("../services/sendEmail");

//console.log(app.locals.age)
// converting user password to hashed password
const securePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadNotFound = (req, res) => {
  res.render("404", { title: "not found" });
};

const loadRegister = async (req, res, next) => {
  try {
    res.render("registration", {
      layout: "../layouts/login/register",
      title: "register",
    });
  } catch (error) {
    next(error.message);
  }
};

const verifyOTP = (req, res) => {
  // res.render("verification", {title:"VerifyOTP"});
  const { otp } = req.body;
  console.log(otp);

  if (req.session.otp == otp) {
    res.status(200).send({ otp: otp, message: "success" }).json();
  } else {
    res.status(200).send({ otp: otp, message: "failure" }).json();
  }
};

const verifyOtpResetPassword = (req, res) => {
  // res.render("verification", {title:"VerifyOTP"});
  //const { otp } = req.body;

  //if (req.session.otp == otp) {
  res.json({ success: true });
  //} else {
  // res.json({ success: false, error: "OTP is not correct" });
  //}
};

const resetpasswd = (req, res) => {
  res.render("resetpasswd");
};
// create a new user

const checkvalues = async (req, res) => {
  const { name, email, password } = req.body;

  if (name !== "" && email !== "" && password !== "") {
    const checkmail = await sendEmail(email);

    req.session.otp = checkmail;

    if (req.session.otp) {
      res.status(200).send({ message: "success", otp: req.session.otp }).json();
    }
  }
};

const insertUser = async (req) => {
  try {
    //console.log(user)

    const { name, email, password } = req.body;

    if (name !== "" && email !== "" && password !== "") {
      //console.log(name)
      const errors = await validateUser(req.body);

      if (typeof errors !== "object") {
        console.log(errors);
      } else {
        console.log("i am fron insert user function");

        const spassword = await securePassword(password);
        const user = new User({
          name,
          email,
          password: spassword,
          role: "user",
          create: new Date(),
        });

        const userData = await user.save();

        if (userData) {
          return { message: "success" };
        } else return { message: "Registration failed" };
      }
    } else {
      console.log("something error will coming");
    }
  } catch (error) {
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
const sendOtp = async (req, res) => {
  const { email } = req.body;

  const userData = await User.findOne({ email, role: "user" });
  if (!userData) {
    res.json({
      success: false,
      errors: "The Email address is not registered with us",
    });
    return;
  }

  if (userData.status == "Deactive") {
    res.json({
      success: false,
      errors: "Your account has been blocked. Contact administrator",
    });
  } else {
    const checkmail = sendEmail(email);
    req.session.email = email;
    req.session.otp = checkmail;
    res.json({ success: true });
  }
};

const forgotPassword = async (req, res) => {
  try {
    res.render("forgotPassword");
  } catch (error) {
    console.log(error.message);
  }
};

const googleLogin = async (req, res) => {
  console.log(req.body);

  /*

  try {
    //console.log(user)

    const { name, email } = req.body;
    const password = "user@123";

    if (name !== "" && email !== "") {
      //console.log(name)

      const spassword = await securePassword(password);

      const user = new User({
        name,
        email,
        password: spassword,
        role: "user",
        create: new Date(),
      });

      const userData = await user.save();

      if (userData) {
        return { message: "success" };
      }
    }
  } catch (error) {
    console.log(error.message);
  }

  */
};

const verifyLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    res.render("login", { email: "Email is required" });
  } else if (!password) {
    res.render("login", { password: "Password is required", evalue: email });
  } else {
    try {
      const errors = validationResult(req.body);

      if (errors.isEmpty()) {
        const userData = await User.findOne({ email, role: "user" });
        if (userData.status == "Deactive") {
          res.render("login", {
            errors: "Your account has been blocked. Contact administrator",
          });
        } else {
          if (userData) {
            const passwordMatch = await bcrypt.compare(
              password,
              userData.password
            );

            if (passwordMatch) {
              req.session.user_id = userData._id;
              req.session.currentUser = userData;
              req.session.uname = userData.name;
              res.cookie("un", userData.name);
              req.session.userIsThere = {
                isAlive: true,
                userName: userData.name,
              };
              req.session.save();
              res.redirect("/");

              //console.log(userData)

              // res.redirect("/home",{username:userData.name});
            } else {
              if (email == "")
                res.render("login", { email: "Email is required" });
            }
          } else {
            res.render("login", {
              errors: "User doesn't exist Please register",
            });
          }
        }
      } else {
        res.render("login", {
          errors: errors.array()[0].msg,
          old: {
            email: email,
          },
        });
      }
    } catch (error) {
      return next(error);
    }
  }
};

const loadHome = async (req, res) => {
  let word = "Guest";

  const prod_list = await Product.find({ status: true });

  // console.log(prod_list)

  if (req.session.uname) {
    word = req.session.uname;
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);

    res.render("home", { name: capitalized, products: prod_list });
    return;
  } else {
    // const capitalized = word.charAt(0).toUpperCase()+ word.slice(1)
    res.render("home", { name: word, products: prod_list });
    //res.render("home", {name:capitalized});
    return;
  }
};

const productPage = async (req, res) => {
  // console.log(prod)
  // return

  let name = "Guest";
  if (req.session.uname) {
    name = req.session.uname;
  } else {
    name = "Guest";
  }

  const p_list = profileController.getAllPorducts();

  // console.log("The user name is :", name)
  res.render("producthome", { name: name, products: p_list });

  //res.render("product-details",{name:"guest"})
  // res.render("product-details",{name:"suresh"})
};

const productDetails = async (req, res) => {
  const id = req.params.id;

  const prod = await Product.findOne({ _id: id }).populate("category", "name");

  // console.log(prod)
  // return

  if (!prod) {
    res.send({ success: false }).json();
  }
  let name = "Guest";
  if (req.session.uname) {
    name = req.session.uname;
  } else {
    name = "Guest";
  }
  // console.log("The user name is :", name)
  res.render("product-details", { name: name, proddata: prod });

  //res.render("product-details",{name:"guest"})
  // res.render("product-details",{name:"suresh"})
};

const notfound = (req, res) => {
  res.render("404");
};

const verifyOtpPassword = (req, res) => {
  res.render("verifyotppassword");
  // res.json({ success: true });
};

const otpForgotPassword = (req, res) => {
  console.log(req.body);

  // res.json({ success: true });
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("un");
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  verifyOTP,
  checkvalues,
  notfound,
  productDetails,
  forgotPassword,
  productPage,
  sendOtp,
  verifyOtpPassword,
  otpForgotPassword,
  verifyOtpResetPassword,
  googleLogin,
  resetpasswd,
  loadNotFound,
};
