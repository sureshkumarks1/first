const { Product } = require("../models/productModel");
const { Catagory } = require("../models/catagoryModel");
const { orderCollection } = require("../models/orderModel");
const upload = require("../middleware/upload");
const sharp = require("sharp");
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
  const orders_list = await orderCollection.find();

  // console.log(orders_list)

  if (!orders_list) {
    res.status(501).json({ success: false }).send();
  }

  res.send({ data: orders_list }).json();
};
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
};
