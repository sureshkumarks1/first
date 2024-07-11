const { Admin } = require("../models/adminModel");
const { User } = require("../models/userModel");
const { orderCollection } = require("../models/orderModel");
const dashboardHelper = require("../helper/dashboardHelper");
const bcrypt = require("bcrypt");

//show the login page
const loadLogin = async (req, res) => {
  try {
    res.render("login", { title: "Login" });
  } catch (error) {
    console.log(error.message);
  }
};

const loadChart = async (req, res) => {
  try {
    res.render("chart", { title: "Chart" });
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserData = async (req, res) => {
  try {
    const userdata = await User.find();

    res.json({ data: userdata });
    // res.send({title:"Users List", data : userdata });
  } catch (error) {
    console.log(error.message);
  }
};

const loadUsersNew = async (req, res) => {
  try {
    const userdata = await User.find();

    res.render("usernew", { title: "Users List", user: userdata });
    // res.send({title:"Users List", data : userdata });
  } catch (error) {
    console.log(error.message);
  }
};

const loadUsers = async (req, res) => {
  try {
    const userdata = await User.find();

    res.render("users", { title: "Users List", user: userdata });
    // res.send({title:"Users List", data : userdata });
  } catch (error) {
    console.log(error.message);
  }
};

//verifying the admin
const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const adminData = await Admin.findOne({ email });

      if (adminData) {
        const passwordMatch = await bcrypt.compare(
          password,
          adminData.password
        );

        if (passwordMatch) {
          if (adminData.role == "admin") {
            req.session.admin_id = adminData._id;
            console.log("The admin session id : ", req.session.admin_id);
            res.cookie("adn", adminData.name);
            //res.redirect("/admin/home");
            res.send({ message: "success", title: "login" }).json();
          }
        } else {
          //console.log("error showing ")
          res.send({ message: "passwordmismatch", title: "login" });
        }
      } else {
        res.send({ message: "nouser" });
      }
    } else {
      res.send({ message: "failure" });
    }

    // const adminData = await User.findOne({ email , role:'admin'});

    // if (adminData) {
    //   const passwordMatch = await bcrypt.compare(password, adminData.password);
    //   if (passwordMatch) {

    //     if (adminData.is_admin == 1) {
    //       req.session.admin_id = adminData._id;
    //       res.redirect("/admin/home");
    //     } else {
    //       res.render("login",{message:"Invalid Credentials",title:"login"})
    //     }

    //   } else {
    //     res.render("login", { message: "incorrect Username/Password",title:"login"  });
    //   }
    // } else {
    //   res.render("login", { message: "incorrect Username/Password",title:"login" });
    // }
  } catch (error) {
    console.log(error.message);
  }
};

// for admin logout
const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("adn");
    // console.log("The admin session id at the logout: ",req.session.admin_id)
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

//for creating new user
const newUserload = async (req, res) => {
  try {
    res.render("add_user");
  } catch (error) {
    console.log(error.message);
  }
};

//for creating new admin
const newAdminload = async (req, res) => {
  try {
    res.render("add_admin");
  } catch (error) {
    console.log(error.message);
  }
};

const editUserLoads = async (req, res) => {
  try {
    const id = req.query.id;
    const userdata = await User.findById({ _id: id });
    if (userdata) {
      res.render("edit-user", { user: userdata });
    } else {
      res.redirect("/admin/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const salesReport = (req, res, next) => {
  let startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : new Date();

  let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

  startDate.setUTCHours(0, 0, 0, 0);
  // endDate.setUTCHours(23, 59, 59, 999);

  console.log(startDate, endDate);
  const locals = { title: "Shoecase - Reports" };
  const orders = [];
  res.render("salesreport", { startDate, endDate, orders, locals });
};

const updateUser = async (req, res) => {
  try {
    const userdata = await User.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
        },
      }
    );

    res.redirect("/admin/home");
  } catch (error) {
    console.log(error.message);
  }
};

//block user
const blockUser = async (req, res) => {
  try {
    let status = req.body.status;

    if (status == "Active") {
      status = "Deactive";
    } else {
      status = "Active";
    }

    const userdata =
      (await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            status: status,
          },
        }
      )) * res.send({ message: status });
  } catch (error) {
    res.send({ message: "Failure" });
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/home");
  } catch (error) {
    console.log(error.message);
  }
};

const securePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const insertAdmin = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      is_admin: 0,
    });

    const userData = await user.save();
    if (userData) {
      res.render("add_user", { message: "Registration Successfull" });
    } else res.render("add_user", { message: "Registration failed" });
  } catch (error) {
    console.log(error.message);
  }
};

//insert new admin
const insertNewAdmin = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      is_admin: 1,
    });

    const userData = await user.save();
    if (userData) {
      res.render("add_admin", { message: "Registration Successfull" });
    } else res.render("add_admin", { message: "Registration failed" });
  } catch (error) {
    console.log(error.message);
  }
};
//load dashBoard
const adminDashboard = async (req, res, next) => {
  try {
    const userdata = await User.find({ role: "admin" });
    res.render("home", {
      user: userdata,
    });
  } catch (error) {
    next(error);
  }

  // res.render("admin/dashboard", {
  //   bestSellingCategory,
  //   bestSellingProducts,
  //   bestSellingBrand,
  // });
};

const test = (req, res, next) => {
  res.json({ message: "Working" });
};

//admin dashboard data
const dashboardData = async (req, res, next) => {
  try {
    const [
      productCount,
      userCount,
      categoryCount,
      pendingOrdersCount,
      totalOrdersCount,
      totalRevenue,
      currentDayRevenue,
      currentMonthRevenue,
      currentWeekRevenue,
      categoryWiseRevenue,
    ] = await Promise.all([
      dashboardHelper.productCount(),
      dashboardHelper.userCount(),
      dashboardHelper.categoryCount(),
      dashboardHelper.pendingOrdersCount(),
      dashboardHelper.totalOrdersCount(),
      dashboardHelper.totalRevenue(),
      dashboardHelper.currentDayRevenue(),
      dashboardHelper.currentMonthRevenue(),
      dashboardHelper.currentWeekRevenue(),
      dashboardHelper.categoryWiseRevenue(),
    ]);
    const data = {
      productCount,
      userCount,
      categoryCount,
      pendingOrdersCount,
      totalOrdersCount,
      totalRevenue,
      currentDayRevenue,
      currentMonthRevenue,
      currentWeekRevenue,
      categoryWiseRevenue,
    };

    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loadLogin,
  verifyLogin,
  adminDashboard,
  adminLogout,
  newUserload,
  newAdminload,
  insertAdmin,
  insertNewAdmin,
  editUserLoads,
  updateUser,
  deleteUser,
  loadChart,
  loadUsers,
  blockUser,
  loadUsersNew,
  loadUserData,
  dashboardData,
  test,
  salesReport,
};
