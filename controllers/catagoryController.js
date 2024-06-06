const { status } = require("ejs");
const { Catagory, validateCat } = require("../models/catagoryModel");

//catagory adding form showing
const add_cat = (req, res) => {
  res.render("add_cat", { title: "Add New Catagory" });
};

//delete catagory from database

const del_cat = async (req, res) => {
  const filter = { _id: req.body.id };
  const update = { status: false };

  let doc = await Catagory.findOne({ _id: req.body.id });

  // Document changed in MongoDB, but not in Mongoose
  await Catagory.updateOne(filter, { status: false });

  // This will update `status`  to `false`, even though the doc changed.
  doc.status = update.status;
  await doc
    .save()
    .then(() => {
      res.send({ message: "success" });
    })
    .catch((err) => {
      res.send({ message: "Failed" });
    });
};

//edit catagory

const edt_cat = async (req, res) => {
  const filter = { _id: req.body.id };
  const update = { status: req.body.status, name: req.body.name };

  /* checking the name already existed or not */

  const checkName = await checkNameInUse(update.name);

  if (checkName) {
    console.log(checkName);
    res.send({ message: "failed" });

    //return;
  } else {
    let doc = await Catagory.findOne({ _id: req.body.id });

    // Document changed in MongoDB, but not in Mongoose
    await Catagory.updateOne(filter, {
      status: update.status,
      name: update.name,
    });

    // This will update `status`  to `new status`, even though the doc changed.
    doc.status = update.status;
    doc.name = update.name;

    await doc
      .save()
      .then(() => {
        res.send({ message: "success" });
      })
      .catch((err) => {
        res.send({ message: "Failed" });
      });
  }
};

//check the name alreadry in use
async function checkNameInUse(name) {
  let result = await Catagory.findOne({ name: name }).select("_id");
  //console.log(result)
  return result;
}

//insert new catagory to database

const insertCat = async (req, res) => {
  // res.send({"message":"success"})
  const name = req.body.name;
  const status = req.body.status;

  const checkName = await checkNameInUse(name);

  if (checkName) {
    res.send({ message: "Name already existed", success: false });
    return;
  }

  const values = {
    name,
  };

  const result = await validateCat(values);

  console.log(result);

  if (result) {
    const catagory = new Catagory({
      name,
      status: status,
    });

    await catagory
      .save()
      .then((result) => {
        res.send({ message: "success", id: result._id, success: true });
      })
      .catch((err) => {
        res.send({ message: "Failed" });
      });
  } else {
    res.send({ message: "Something Wrong" });
  }
};

// loadin all catagories to adim page
const loadCat = async (req, res) => {
  try {
    const catdata = await Catagory.find({ status: true });

    //   res.render("catagory",{title:"Catagory List", catdata : catdata });

    res.render("catagory", { title: "Catagory List" });
    res.send({ catdata: catdata }).json();
    //   return catdata
  } catch (error) {
    console.log(error.message);
  }
};

const getCat = async (req, res) => {
  try {
    const catdata = await Catagory.find({ status: true });

    //   res.render("catagory",{title:"Catagory List", catdata : catdata });
    //    res.render("catagory",{title:"Catagory List" });
    res.send({ data: catdata }).json();
    //   return catdata
  } catch (error) {
    console.log(error.message);
  }
};

//get catagory by id

const getCatById = async (req, res) => {
  try {
    const catdata = await Catagory.findOne({ _id: req.body.id });
    //   console.log(catdata.name)
    res.send({ name: catdata.name }).json();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadCat,
  insertCat,
  add_cat,
  del_cat,
  edt_cat,
  getCat,
  getCatById,
};
