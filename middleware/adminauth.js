
const isLogin = async (req, res,next) => {
  try {
    if (req.cookies.adn) {
      next();
    }
    else {
      res.redirect("/admin/login");
    }
    
  }
  catch (error) {
    console.log(error.message);
}  
}


const isLogout = async (req, res,next) => {
  try {
    if (req.cookies.adn) {
      //req.cookies.un = ''
      res.redirect("/admin/home")
    } else {
      next();
    }
  }
  catch (error) {
    console.log(error.message);
}  
}

module.exports={isLogin,isLogout}