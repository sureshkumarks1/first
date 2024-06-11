const { Product } = require("../models/productModel");
const { Catagory } = require("../models/catagoryModel");
const { orderCollection } = require("../models/orderModel");

const upload = require("../middleware/upload");
const sharp = require("sharp");
const { name } = require("ejs");
sharp.cache(false);
const loadProd = (req, res) => {
  //const prod = product.find()
  res.render("product", { title: "products" });
};
const loadOrders = (req, res) => {
  //const prod = product.find()
  res.render("orders", { title: "orders" });
};

const add_prod = async (req, res) => {
  const catdata = await Catagory.find({ status: true }).select("name _id");

  res.render("add_prod", {
    title: "Add Products",
    category: catdata,
    errors: "",
  });
};

const updt_prod = async (req, res) => {
  console.log("this is working");
  const filter = { _id: req.body._id };

  let image1, image2, image3;

  let imgname = "";
  let newimgname = "";

  const { pname, pdescription, pcategory, productprice, productstock } =
    req.body;

  let product = {};

  if (req.files.length == 0) {
    //console.log("No files")

    product = {
      name: pname,
      description: pdescription,
      stock: productstock,
      price: productprice,
      // image:newimg,
      // images:[image1,image2,image3] ,
      category: pcategory,
    };
  } else {
    const filetypeerr = req.files.map((file) => {
      return file.mimetype != "image/jpeg" ? false : true;
    });

    const catdata = await Catagory.find({ status: true }).select("name _id");

    if (filetypeerr.includes(false)) {
      filetype = "File type not allowed";

      res.render("add_prod", {
        title: "products",
        errors: filetype,
        category: catdata,
      });
    } else {
      if (req.body.img0 == "changedone") {
        image1 = "http://localhost:3000/uploads/" + req.files[0].filename;

        imgname = req.files[0].filename;
        newimgname = imgname.replace(".jpg", "");

        // let imgname = Date.now()
        resizeimage(req.files[0], newimgname);
        resizeimagefour(req.files[0], newimgname);
      } else {
        image1 = req.body.img0;
      }

      if (req.body.img1 == "changedtwo") {
        image2 = "http://localhost:3000/uploads/" + req.files[0].filename;

        imgname = req.files[0].filename;
        newimgname = imgname.replace(".jpg", "");

        resizeimage(req.files[0], newimgname);
        resizeimagefour(req.files[0], newimgname);
      } else {
        image2 = req.body.img1;
      }
      if (req.body.img2 == "changedthree") {
        image3 = "http://localhost:3000/uploads/" + req.files[0].filename;

        imgname = req.files[0].filename;
        newimgname = imgname.replace(".jpg", "");

        resizeimage(req.files[0], newimgname);
        resizeimagefour(req.files[0], newimgname);
      } else {
        image3 = req.body.img2;
      }

      if (req.body.img1 == "changedtwo" && req.body.img0 == "changedone") {
        image1 = "http://localhost:3000/uploads/" + req.files[0].filename;
        image2 = "http://localhost:3000/uploads/" + req.files[1].filename;

        for (let i = 0; i < 2; i++) {
          imgname = req.files[i].filename;
          newimgname = imgname.replace(".jpg", "");
          resizeimage(req.files[i], newimgname);
          resizeimagefour(req.files[i], newimgname);
        }
      }

      if (
        req.body.img2 == "changedthree" &&
        req.body.img1 == "changedtwo" &&
        req.body.img0 == "changedone"
      ) {
        image1 = "http://localhost:3000/uploads/" + req.files[0].filename;
        image2 = "http://localhost:3000/uploads/" + req.files[1].filename;
        image3 = "http://localhost:3000/uploads/" + req.files[2].filename;

        for (let i = 0; i < 3; i++) {
          imgname = req.files[i].filename;
          newimgname = imgname.replace(".jpg", "");
          resizeimage(req.files[i], newimgname);
          resizeimagefour(req.files[i], newimgname);
        }
      }

      // let imgname = Date.now()
      // resizeimage(req.files, imgname);
      // resizeimagefour(req.files, imgname);

      product = {
        name: pname,
        description: pdescription,
        stock: productstock,
        price: productprice,
        image: image1,
        images: [image1, image2, image3],
        category: pcategory,
      };

      //  console.log(product)

      const rest = await Product.updateOne(filter, product);

      console.log(rest);
      if (rest.acknowledged == true) {
        res.redirect("/admin/products");
      } else {
        res.redirect("/admin/products").json({ success: false });
      }
      //     // res.status(500).json({error:err, success:false})
    }
  }
};

async function resizeimage(files, imgn) {
  try {
    let newimg = "";

    newimg = "uploads/" + imgn + "-resized-1024.jpg";
    await sharp(files.path)
      .resize({
        width: 1024,
        height: 1024,
        fit: "fill",
      })
      .toFile(newimg);
  } catch (err) {
    console.log("the error coming from file update", err);
  }
}

async function resizeimagefour(files, imgnn) {
  try {
    let newimg400 = "";

    newimg400 = "uploads/" + imgnn + "-resized-400.jpg";
    await sharp(files.path)
      .resize({
        width: 400,
        height: 400,
        fit: "fill",
      })
      .toFile(newimg400);
  } catch (err) {
    console.log("the error coming from file update", err);
  }
}

const getOrders = async (req, res) => {
  try {
    const orders_list = [{ orderNumber: 101 }, { orderNumber: 102 }];
    // const orders_list = await orderCollection.find();

    console.log(orders_list);

    if (!orders_list) {
      res.status(501).json({ success: false }).send();
    }

    res.send({ data: orders_list }).json();
  } catch (err) {
    console.log("The error is : ", err);
  }
};

// product get all

const productPage = async (req, res) => {
  let name = "Guest";
  if (req.session.uname) {
    name = req.session.uname;
  } else {
    name = "Guest";
  }

  const p_list = await getAllPorducts();
  res.render("producthome", { name: name, products: p_list.products });
};

const getAllPorducts = async (req, res) => {
  const prod_list = await Product.find({ status: true });
  return { products: prod_list };
};

const getAllPorductsByCategory = async (req, res) => {
  const prod_list = await Product.find({
    status: true,
    category: req.body.category,
  });
  return { products: prod_list };
};

async function getprod(arg) {
  if (arg == "all") {
    const prod_list = await Product.find({
      status: true,
    });
    const count = prod_list.length;
    return { count, prod_list };
  } else if (arg == "high") {
    const prod_list = await Product.find({
      status: true,
    }).sort({ price: -1 });
    const count = prod_list.length;
    return { count, prod_list };
  } else if (arg == "low") {
    const prod_list = await Product.find({
      status: true,
    }).sort({ price: 1 });
    const count = prod_list.length;
    return { count, prod_list };
  } else if (arg == "az") {
    const prod_list = await Product.find({
      status: true,
    }).sort({ name: 1 });
    const count = prod_list.length;
    return { count, prod_list };
  } else if (arg == "za") {
    const prod_list = await Product.find({
      status: true,
    }).sort({ name: -1 });
    const count = prod_list.length;
    return { count, prod_list };
  } else if (arg == "featured") {
    const prod_list = await Product.find({
      status: true,
      tags: "featured",
    }).sort({ name: -1 });
    const count = prod_list.length;
    return { count, prod_list };
  } else if (arg == "popularity") {
    console.log("The argument is :", arg);
    const prod_list = await Product.find({
      status: true,
      tags: "popularity",
    }).sort({ name: -1 });
    const count = prod_list.length;
    return { count, prod_list };
  } else if (arg == "newarrival") {
    const prod_list = await Product.find({
      status: true,
      tags: "newarrival",
    }).sort({ name: -1 });
    const count = prod_list.length;
    return { count, prod_list };
  } else {
    const prod_list = {};
    const count = 0;
    return { count, prod_list };
  }
}

const getAllPorductsByPriceRange = async (req, res) => {
  // console.log("The range value is :", req.body.range);
  if (req.body.range == "all") {
    // console.log(await getprod());
    const { count, prod_list } = await getprod("all");

    res.send({ products: prod_list, count, success: true });
  } else if (req.body.range == "high") {
    const { count, prod_list } = await getprod("high");
    res.send({ products: prod_list, count, success: true });
  } else if (req.body.range == "low") {
    const { count, prod_list } = await getprod("low");
    res.send({ products: prod_list, count, success: true });
  } else if (req.body.range == "az") {
    const { count, prod_list } = await getprod("az");
    res.send({ products: prod_list, count, success: true });
  } else if (req.body.range == "za") {
    const { count, prod_list } = await getprod("za");
    res.send({ products: prod_list, count, success: true });
  } else if (req.body.range == "featured") {
    const { count, prod_list } = await getprod("featured");
    res.send({ products: prod_list, count, success: true });
  } else if (req.body.range == "popularity") {
    const { count, prod_list } = await getprod("popularity");
    res.send({ products: prod_list, count, success: true });
  } else if (req.body.range == "newarrival") {
    const { count, prod_list } = await getprod("newarrival");
    res.send({ products: prod_list, count, success: true });
  } else {
    const range = req.body.range.split("-");

    const minPrice = range[0];
    const maxPrice = range[1];

    try {
      const prod_list = await Product.find({
        status: true,
        price: { $gte: minPrice, $lte: maxPrice },
      });

      const count = prod_list.length;

      res.send({ products: prod_list, count, success: true });
    } catch (error) {
      console.log(error);
    }
  }
  //res.send({ success: true });
};

//ends here

const getProd = async (req, res) => {
  const product_list = await Product.find();

  // console.log(product_list)

  if (!product_list) {
    res.status(501).json({ success: false }).send();
  }

  res.send({ data: product_list }).json();
};

const del_prod = async (req, res) => {
  const filter = { _id: req.body.id };

  let doc = await Product.findOne({ _id: req.body.id }).select("status");

  // console.log("The result is :",doc?.status)

  const status = doc.status ? false : true;

  const update = { status: status };

  await Product.updateOne(filter, { status: status });

  doc.status = update.status;
  await doc
    .save()
    .then(() => {
      res.send({ message: "success", status: status });
    })
    .catch((err) => {
      res.send({ message: "Failed" });
    });
};

const getProdById = async (req, res) => {
  try {
    const proddata = await Product.findOne({ _id: req.body.id });
    //   console.log(catdata.name)
    res.send({ data: proddata }).json();
  } catch (error) {
    console.log(error.message);
  }
};

const edt_prod = async (req, res) => {
  const id = req.params.id;

  try {
    const catdata = await Catagory.find({ status: true });
    const proddata = await Product.findOne({ _id: id });
    //   console.log(catdata.name)
    // console.log(proddata)
    res.render("edit-prod", { category: catdata, prod: proddata });
  } catch (error) {
    console.log(error.message);
  }

  // const update = { status: req.body.status, name:req.body.name };

  // let doc = await Product.findOne({ _id: req.body.id });

  // // Document changed in MongoDB, but not in Mongoose
  //  await Product.updateOne(filter, { status: update.status, name:update.name});

  // // This will update `status`  to `new status`, even though the doc changed.
  // doc.status = update.status;
  // doc.name = update.name;

  // await doc.save().then(()=>{
  //     res.send({'message':"success"})
  // }).catch((err)=>{
  //     res.send({'message':"Failed"})
  // });
};

const insertProd = async (req, res) => {
  const filetypeerr = req.files.map((file) => {
    return file.mimetype != "image/jpeg" ? false : true;
  });

  const catdata = await Catagory.find({ status: true }).select("name _id");

  if (filetypeerr.includes(false)) {
    filetype = "File type not allowed";

    res.render("add_prod", {
      title: "products",
      errors: filetype,
      category: catdata,
    });
  } else {
    const image1 = "http://localhost:3000/uploads/" + req.files[0].filename;
    const image2 = "http://localhost:3000/uploads/" + req.files[1].filename;
    const image3 = "http://localhost:3000/uploads/" + req.files[2].filename;

    // console.log(req.files)
    // resizeimage(req.files)
    for (let i = 0; i < 3; i++) {
      imgname = req.files[i].filename;
      newimgname = imgname.replace(".jpg", "");
      resizeimage(req.files[i], newimgname);
      resizeimagefour(req.files[i], newimgname);
    }

    // console.log(arrres)

    //const newimg = 'http://localhost:3000/uploads/'+ Date.now()+"-resized.jpg";

    const { pname, pdescription, pcategory, productprice, productstock } =
      req.body;

    const product = new Product({
      name: pname,
      description: pdescription,
      stock: productstock,
      price: productprice,
      image: image1,
      images: [image1, image2, image3],
      category: pcategory,
    });

    const psaved = await product.save();

    if (psaved) {
      res.redirect("/admin/products");
    } else {
      res.status(500).json({ error: err, success: false });
    }
  }
};

module.exports = {
  loadProd,
  add_prod,
  getProd,
  insertProd,
  del_prod,
  getProdById,
  edt_prod,
  updt_prod,
  getOrders,
  loadOrders,
  productPage,
  getAllPorductsByPriceRange,
  getAllPorductsByCategory,
};
