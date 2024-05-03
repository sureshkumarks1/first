const express = require('express')
const product_route = express.Router()

const path = require('path')

const upload = require('../middleware/upload')

const product = require("../controllers/productController");

// product_route.set('/uploads', express.static(path.join(__dirname,'../..','/uploads')))

product_route.get('/', product.loadProd)
product_route.get('/get', product.getProd)
product_route.get('/getprod', product.getProdById)
// product_route.post('/getcat', product.getProdById)
product_route.post('/insertprod', upload.any(),  product.insertProd)
product_route.get('/add', product.add_prod)
product_route.post('/del', product.del_prod)
product_route.get('/prodedt/:id', product.edt_prod)
product_route.post('/produpdtn', upload.any(), product.updt_prod)

module.exports = product_route;