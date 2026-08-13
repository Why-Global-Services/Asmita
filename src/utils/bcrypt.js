const bcrypt = require("bcrypt");
const ApiError = require("./apiError");

const genSalt = 10;

const hashPassword = (pass) => {
  if (!pass) throw new ApiError(400, "No password provided");
  return bcrypt.hash(pass, genSalt);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword)
    throw new ApiError(400, "No password provided");
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
