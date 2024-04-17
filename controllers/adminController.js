const {User} = require("../models/userModel");
const bcrypt = require("bcrypt");
 
//show the login page
const loadLogin = async (req,res) => {
  try {
    res.render("login",{title:"Login"});
  }
  catch (error) {
    console.log(error.message);
  }
}

const loadChart = async (req,res) => {
  try {
    res.render("chart",{title:"Chart"});
  }
  catch (error) {
    console.log(error.message);
  }
}

const loadUsers = async (req, res) => {
  try {
    
    const userdata = await User.find();

    res.render("users",{title:"Users List", user : userdata });

  }
  catch (error) {
    console.log(error.message);
  }
}


//verifying the admin
const verifyLogin = async (req, res) => {

  try {
    const {email , password } = req.body;
    
    const adminData = await User.findOne({ email , is_admin:{$eq:1}});
    
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);      
      if (passwordMatch) {
        
        if (adminData.is_admin == 1) {
          req.session.admin_id = adminData._id;
          res.redirect("/admin/home");
        } else {
          res.render("login",{message:"Invalid Credentials",title:"login"})
        }
        
      } else {
        res.render("login", { message: "incorrect Username/Password",title:"login"  });
      }
    } else {
      res.render("login", { message: "incorrect Username/Password",title:"login" });
    }
  } catch (error) {
    console.log(error.message); 
  }
};


const adminDashboard = async (req, res) => {
  try {
    // var search = '';
    // if (req.query.search) {
    //   search = req.query.search;
    // }
    // const userdata = await User.find({
    //   is_admin: 0,
    //   $or: [
    //     { name: { $regex: ".*" +search+ ".*" ,$options:"i"} },
    //     { email: { $regex: ".*" +search+ ".*",$options:"i" } },
    //     { mobile: { $regex: ".*" +search+ ".*",$options:"i" } }
    //   ]
    // });
    const userdata = await User.find({role:'admin'})
    res.render("home",{user:userdata});
  } catch (error) {
    console.log(error.message);
  }
};

// for admin logout
const adminLogout = async (req,res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  }
  catch (error) {
    console.log(error.message)
  }
}

//for creating new user
const newUserload = async (req, res) => {
  try {
    res.render("add_user");
  }
  catch (error)
  {
    console.log(error.message);
  }

}


//for creating new admin
const newAdminload = async (req, res) => {
  try {
    res.render("add_admin");
  }
  catch (error)
  {
    console.log(error.message);
  }

}

const editUserLoads = async (req, res) => {
  try {
    const id = req.query.id;
    const userdata = await User.findById({ _id: id })
    if (userdata) {
      res.render("edit-user", { user: userdata });
    }
    else {
      res.redirect("/admin/home")
    }
  }
  catch (error) {
    console.log(error.message);
  }
}
 
const updateUser = async (req,res) => {
  try {
    
    const userdata = await User.findByIdAndUpdate({ _id: req.body.id },{$set:{
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile
    }
    })

    res.redirect("/admin/home");
  }
  catch (error) {
    console.log(error.message);
  }
}
const deleteUser = async (req, res) =>
{
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/home");
  }
  catch (error) {
    console.log(error.message);
  }
  }
  
  const securePassword = async (password) => {

    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
};
  
  const insertAdmin = async (req, res) => {
    try {
      const spassword = await securePassword(req.body.password);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: spassword,
        is_admin: 0,
      });
  
      const userData = await user.save();
      if (userData) {
        res.render("add_user", { message: "Registration Successfull" });
      } else res.render("add_user", { message: "Registration failed" });
    } catch (error) {
      console.log(error.message);
    }
  };

//insert new admin 
const insertNewAdmin = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      is_admin: 1,
    });

    const userData = await user.save();
    if (userData) {
      res.render("add_admin", { message: "Registration Successfull" });
    } else res.render("add_admin", { message: "Registration failed" });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadLogin,
  verifyLogin,
  adminDashboard,
  adminLogout,
  newUserload,
  newAdminload,
  insertAdmin,
  insertNewAdmin,
  editUserLoads,
  updateUser,
  deleteUser,
  loadChart,
  loadUsers
}