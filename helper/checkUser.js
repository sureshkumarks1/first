function checkUser(name) {
  if (!name) {
    return new Error("No User");
  } else {
    return name;
  }
}

module.exports = { checkUser };
