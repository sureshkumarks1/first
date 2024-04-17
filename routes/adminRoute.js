const express = require("express");
const admin_route = express();
require('dotenv').config()
const session = require("express-session");
const nocache = require("nocache");
const auth = require("../middleware/adminauth");

const admin= require("../controllers/adminController");

admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));

admin_route.use(nocache());

admin_route.use(express.static("public"));

admin_route.set("view engine", "ejs");

admin_route.set("views", "./views/admin");

admin_route.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));


admin_route.get("/",auth.isLogout, admin.loadLogin);

//admin_route.post("/", admin.loadLogin);

admin_route.get("/login", admin.loadLogin);

admin_route.get("/chart", admin.loadChart);

admin_route.get("/users", admin.loadUsers);

admin_route.post("/verify", admin.verifyLogin);

//admin_route.get("/home",auth.isLogin, admin.adminDashboard);
admin_route.get("/home", admin.adminDashboard);



admin_route.get("/logout", auth.isLogin, admin.adminLogout);

admin_route.get("/adduser", auth.isLogin, admin.newUserload);

admin_route.get("/addadmin", auth.isLogin, admin.newAdminload);

admin_route.get("/edit-user", auth.isLogin,admin.editUserLoads);

admin_route.post("/add-user", admin.insertAdmin);

admin_route.post("/add-admin", admin.insertNewAdmin);

admin_route.post("/edit-user", admin.updateUser);

admin_route.get("/delete-user", admin.deleteUser);

admin_route.get("*", (req, res) => {

  res.redirect("/admin");

})

module.exports = admin_route;