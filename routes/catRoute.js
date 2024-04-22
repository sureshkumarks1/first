const express = require('express')
const cat_route = express.Router()

const catagory= require("../controllers/catagoryController");

cat_route.get('/', catagory.loadCat)
cat_route.get('/get', catagory.getCat)
cat_route.post('/getcat', catagory.getCatById)
cat_route.post('/insertcat', catagory.insertCat)
cat_route.get('/add', catagory.add_cat)
cat_route.post('/del', catagory.del_cat)
cat_route.post('/edt', catagory.edt_cat)

module.exports = cat_route;