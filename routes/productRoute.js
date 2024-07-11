const express = require("express");
const product_route = express.Router();
// const flash = require("req-flash");

const path = require("path");
product_route.use(express.urlencoded({ extended: true }));

const upload = require("../middleware/upload");

const product = require("../controllers/productController");

// product_route.set('/uploads', express.static(path.join(__dirname,'../..','/uploads')))
// product_route.use(flash());
const cors = require("cors");

product_route.use(cors());

product_route.get("/", product.loadProd);
product_route.get("/orders", product.loadOrders);
product_route.get("/getorders", product.getOrders);

product_route.get("/get", product.getProd);
// product_route.get('/orders', product.getOrders)
product_route.get("/getprod", product.getProdById); //working
product_route.post("/editproduct", product.getProdByIdForEdit); //working
product_route.get("/getproduct/:id", product.getProdByIdNew);
// product_route.post('/getcat', product.getProdById)
// product_route.post("/insertprod", upload.any(), product.insertProd);//working
product_route.post(
  "/insertprod",
  upload.array("files", 12),
  product.insertProdNew
); //testing
product_route.get("/add", product.add_prod);
product_route.post("/del", product.del_prod);
product_route.get("/prodedt/:id", product.edt_prod);
product_route.post("/products/getitemcount", product.getProdById);
// product_route.post("/produpdtn", upload.any(), product.updt_prod); //working
product_route.post(
  "/produpdtn",
  upload.array("file-input", 12),
  product.updt_prod_new
); //testing
product_route.put("/rating", product.rating);

module.exports = product_route;
