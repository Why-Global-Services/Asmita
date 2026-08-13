const { category } = require("../models/category.model");
const { role } = require("../models/role.model");
const ApiError = require("../utils/apiError");
const { generateAccessToken } = require("../utils/auth");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { bookProduct } = require("../models/bookProduct.model");

const createRole = async (req) => {
  const { body } = req;
console.log("body",req)
  if (!body.email && !body.phoneNumber) {
    throw new ApiError(400, "No email or Phone Number provided");
  }

  const emailExist = await role.findOne({ email: body.email });

  if (emailExist) {
    throw new ApiError(400, "Email already exists");
  }

  body.password = await hashPassword(body.password);

  const createdRole = await role.create(body);

  return {
    success: true,
    message: "Role created successfully",
    data: createdRole,
  };
};

const getRole = async (req) => {
  if (req.user.role !== "superAdmin") {
    throw new ApiError(403, "Unauthorized");
  }

  const roles = await role.aggregate([
    {
      $project: {
        password: 0,
      },
    },
  ]);

  return {
    success: true,
    message: "All role Fetched successfully",
    data: roles,
  };
};

const updateRole = async (req) => {
  const id = req.params.id;
  const { body } = req;

  if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  if (!id) {
    throw new ApiError(400, "No id provided");
  }

  const updatedRole = await role.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  return {
    success: true,
    message: "Role Updated successfully",
    data: updatedRole,
  };
};

const deleteRole = async (req) => {
  const id = req.params.id;

  if (req.user.role !== "superAdmin" && req.user.role !== "user") {
    throw new ApiError(403, "Unauthorized");
  }

  const deletedRole = await role.findByIdAndDelete({ _id: id });

  if (!deletedRole) {
    throw new ApiError(404, "No Data found to delete");
  }

  return {
    success: true,
    message: "Role deleted successfully",
    data: deletedRole,
  };
};

const login = async (req) => {
  const { body } = req;

  const roleData = await role.findOne({ email: body.email });

  const isMatch = await comparePassword(body.password, roleData.password);

  if (!isMatch) {
    throw new ApiError(400, "Wrong email or password");
  }

  const paylaod = {
    _id: roleData._id,
    role: roleData.role,
    name: roleData.name,
  };

  const token = await generateAccessToken(paylaod);

  return {
    success: true,
    accessToken: token,
    role: roleData.role,
    message: "Login successfull",
  };
};

const getProfile = async(req) => {
  const id = req.user._id
  const getProfile = await role.findById({_id: id}).select("-password -__v")

  return {success: true, message: "Profile fetched succesfully", data: getProfile}
}



module.exports = {
  createRole,
  login,
  getRole,
  updateRole,
  deleteRole,
  getProfile,
};
