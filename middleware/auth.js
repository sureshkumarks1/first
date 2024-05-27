const isLogin = async (req, res, next) => {
  try {
    if (req.cookies.un || req.session.uname) {
      next();
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.cookies.un || req.session.uname) {
      res.redirect("/logout");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { isLogin, isLogout };
