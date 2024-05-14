const { User } = require("../models/userModel");

blockuser = async (req, res, next) => {
  try {
    let currentUser = await User.findOne({
      _id: req.session?.user_id,
    });
    if (currentUser?.status == "Deactive") {
      req.session.destroy();
      res.redirect(req.originalUrl);
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports = blockuser;
