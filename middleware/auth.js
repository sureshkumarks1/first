const isLogin = async (req, res, next) => {
  try {
    if (req.cookies.un || req.session.uname || req.session.name) {
      next();
    } else {
      res.redirect("http://localhost:3000/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.cookies.un || req.session.uname || req.session.name) {
      res.redirect("/logout");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { isLogin, isLogout };
