const express = require("express");

const os = require("os");

const admin_route = express();

require("dotenv").config();

const session = require("express-session");

const path = require("path");

const multer = require("multer");

const nocache = require("nocache");

const auth = require("../middleware/adminauth");

const catroute = require("../routes/catRoute");

const product_route = require("../routes/productRoute");

const admin = require("../controllers/adminController");

const catagory = require("../controllers/catagoryController");
const orderController = require("../controllers/orderController");

admin_route.use(express.json());

admin_route.use(express.urlencoded({ extended: true }));

admin_route.use(nocache());

// admin_route.use('uploads', express.static(path.join(__dirname,'..','/uploads')))

// admin_route.use('/uploads',express.static(path.join(__dirname,'..','/uploads')))
admin_route.use(express.static("uploads"));

admin_route.use("/catagory", catroute);

admin_route.use("/products", auth.isLogin, product_route);

admin_route.use(express.static("public"));

admin_route.set("view engine", "ejs");

admin_route.set("views", "./views/admin");

// admin_route.use('uploads',express.static('/uploads'))

//console.log(path.join(__dirname,'..','/uploads'))

// admin_route.use('uploads', express.static('/uploads'))

// const fi = path.join(__dirname,'..', '/uploads')

// console.log(fi)
//console.log(path.join(__dirname,'..','/uploads'))

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + "_" + file.originalname);
  },
});

admin_route.use(multer({ dest: "./uploads" }).single("image"));

// admin_route.set('views', __dirname + '/views/admin');

// console.log(__dirname + '/views/admin')

admin_route.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

admin_route.get("/", auth.isLogout, admin.loadLogin);

//admin_route.post("/", admin.loadLogin);

admin_route.get("/login", auth.isLogout, admin.loadLogin);

admin_route.get("/chart", admin.loadChart);

admin_route.get("/users", auth.isLogin, admin.loadUsers);

// admin_route.get("/catagory",auth.isLogin, catagory.loadCat);

admin_route.post("/verify", admin.verifyLogin);

//admin_route.get("/home",auth.isLogin, admin.adminDashboard);

admin_route.get("/home", auth.isLogin, admin.adminDashboard);

admin_route.get("/logout", auth.isLogin, admin.adminLogout);

admin_route.get("/adduser", auth.isLogin, admin.newUserload);

admin_route.get("/addadmin", auth.isLogin, admin.newAdminload);

admin_route.get("/edit-user", auth.isLogin, admin.editUserLoads);

admin_route.post("/add-user", auth.isLogin, admin.insertAdmin);

admin_route.post("/add-admin", auth.isLogin, admin.insertNewAdmin);

admin_route.post("/edit-user", auth.isLogin, admin.updateUser);

admin_route.get("/delete-user", auth.isLogin, admin.deleteUser);

admin_route.post("/block-user", auth.isLogin, admin.blockUser);

admin_route.get("/orders/getorders", auth.isLogin, orderController.getOrders);

admin_route.post(
  "/order/chgstatus",
  auth.isLogin,
  orderController.updateStatus
);

admin_route.get(
  "/orderDetailsPage/:id",
  auth.isLogin,
  orderController.orderDetailspage
);

// admin_route.get("*", (req, res) => {

//   res.redirect("/admin/login");

// })

module.exports = admin_route;
