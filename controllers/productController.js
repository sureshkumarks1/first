const { Product, validateProduct } = require("../models/productModel");
const { Catagory } = require("../models/catagoryModel");
const { orderCollection } = require("../models/orderModel");
const fs = require("fs");
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

    // console.log(product);
    // const { value, error } = await validateProd(product);
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
    }
  }
  const rest = await Product.updateOne(filter, product);

  console.log(rest);
  if (rest.acknowledged == true) {
    res.redirect("/admin/products");
  } else {
    res.redirect("/admin/products").json({ success: false });
  }
};

const updt_prod_new = async (req, res, next) => {
  try {
    const productData = req.body;
    const filter = { _id: req.body._id };
    delete productData._id;
    console.log(req.body);

    const { error } = validateProduct(productData);
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(200).json({ message: "failed", errors });
    }

    let image;

    image = "http://localhost:3000/uploads/" + req.files[0].filename;

    let newimg = "";
    req.files.forEach(async (file) => {
      newimgname = file.filename.replace(".jpg", "");
      newimg =
        newimg +
        "http://localhost:3000/uploads/" +
        newimgname +
        "-resized-1024.jpg," +
        "http://localhost:3000/uploads/" +
        newimgname +
        "-resized-400.jpg,";

      await resizeImageNew(file.path, newimgname);
      await resizeimagefourNew(file.path, newimgname);
    });
    let newArr = newimg.split(",");
    newArr.pop();

    // }
    const { name, category, price, offer, stock, description } = req.body;

    const data = {
      name,
      description,
      stock,
      offer,
      price,
      image,
      images: newArr,
      category,
    };

    // const product = new Product(data);
    // delete product._id;
    //console.log("This product goest to database", data);
    // return res.json({ message: "success", detail: data });

    const rest = await Product.updateOne(filter, data)
      .then((savedDocument) => {
        return res.json({ message: "success", detail: savedDocument });
      })
      .catch((error) => {
        console.log("have some errors", error);
        return res.json({ message: "failed", error: error });
      });
  } catch (error) {
    next(error);
  }
  /*try {
    let image;
    let images = [];
    // console.log(req.body);
    if (!req.files) {
      image = "http://localhost:3000/uploads/" + req.files[0].filename;
    } else {
      image = "http://localhost:3000/uploads/" + req.files[0].filename;
    }
    const filter = { _id: req.body._id };
    req.files.forEach((file) => {
      newimgname = file.filename.replace(".jpg", "");
      resizeImageNew(file.path, newimgname);
      resizeimagefourNew(file.path, newimgname);
      images.push("http://localhost:3000/uploads/" + file.filename);
    });

    const {
      productName,
      productCategory,
      productPrice,
      productStock,
      productDescription,
    } = req.body;
    // const rest = await Product.updateOne(filter, product);
    const product = {
      name: productName,
      description: productDescription,
      stock: productStock,
      price: productPrice,
      image: image,
      images: images,
      category: productCategory,
    };
    const rest = await Product.updateOne(filter, product);
    console.log(rest);
  } catch (err) {
    console.log(err);
  }*/
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

  console.log("The result is :", doc?.status);

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
const getProdByIdForEdit = (req, res, next) => {
  try {
    console.log("i am from controller");
    console.log(req.body);
    res.json({ data: "working" });
  } catch (error) {
    console.log(err);
  }
};
const getProdByIdNew = async (req, res) => {
  try {
    console.log(req.params);
    const proddata = await Product.findOne({ _id: req.params.id });
    console.log(proddata);
    res.json({ data: proddata });
  } catch (error) {
    next(error);
  }
};
const edt_prod = async (req, res) => {
  const id = req.params.id;

  try {
    const catdata = await Catagory.find({ status: true });
    const proddata = await Product.findOne({ _id: id });
    //   console.log(catdata.name)
    console.log(proddata.images.length);
    res.render("edit-prod", {
      category: catdata,
      prod: proddata,
      count: proddata.images.length,
      name: req.session?.uname || "Guest",
    });
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
const rating = async (req, res, next) => {
  const { _id } = "661bce7972068568c941da65";
  const { star, prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    next(error);
  }
};
async function resizeimagefourNew(path, imgnn) {
  try {
    let newimg400 = "";

    newimg400 = "uploads/" + imgnn + "-resized-400.jpg";
    await sharp(path)
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
async function resizeImageNew(path, imgn) {
  try {
    let newimg = "";
    newimg = "uploads/" + imgn + "-resized-1024.jpg";
    await sharp(path)
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
const insertProdNew = async (req, res, next) => {
  try {
    const productData = req.body;
    const { error } = validateProduct(productData);
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(200).json({ message: "failed", errors });
    } else {
      let image;

      image = "http://localhost:3000/uploads/" + req.files[0].filename;
      let path = "";
      let newimg = "";
      req.files.forEach(async (file) => {
        newimgname = file.filename.replace(".jpg", "");
        newimg =
          newimg +
          "http://localhost:3000/uploads/" +
          newimgname +
          "-resized-1024.jpg," +
          "http://localhost:3000/uploads/" +
          newimgname +
          "-resized-400.jpg,";

        await resizeImageNew(file.path, newimgname);
        await resizeimagefourNew(file.path, newimgname);
      });
      let newArr = newimg.split(",");
      newArr.pop();
      console.log("Image location for array", newArr);
      // }
      const { name, category, offer, price, stock, description } = req.body;

      const data = {
        name,
        description,
        stock,
        offer,
        price,
        image,
        images: newArr,
        category,
      };

      const product = new Product(data);

      console.log("This product goest to database", product);

      const psaved = await product
        .save()
        .then((savedDocument) => {
          // Handle the saved document
          console.log("Document saved successfully:", savedDocument);
          return res.json({ message: "success" });
        })
        .catch((error) => {
          // Handle the error
          console.log("have some errors");
          return res.json({ message: "failed", error: error });
        });
    }
  } catch (error) {
    next(error);
  }
};
const countDocuments = async () => {
  const count = await Product.count();
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
  rating,
  insertProdNew,
  getProdByIdNew,
  getProdByIdForEdit,
  updt_prod_new,
};
