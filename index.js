const express = require("express");
const app = express();
const path = require("path");
let cors = require("cors");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

const multer = require("multer");

const { notFound, errorHandler } = require("./middleware/errormiddle");

const swal = require("sweetalert");
require("dotenv").config();
require("./db/mongo");
// const helmet = require('helmet');
const logger = require("morgan");

const port = process.env.PORT;
// app.use(express.json())

// Using cors
app.use(cors());

//set path to public
app.set("/public", path.join(__dirname, "/public"));
app.set("/nodefile", path.join(__dirname, "/node_modules"));

app.use("/uploads", express.static("uploads"));

//for user routes
app.use("/", userRoute);

//using Logger
app.use(logger("common"));

// app.all("*", notFound);

app.use(errorHandler);

//for admin routes
app.use("/admin", adminRoute);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//application running port
app.listen(port, () => {
  console.log("listening to the port http://localhost : " + port);
});
