const express = require('express');
const adminController = require('../controller/admin.controller');
const { uploads } = require('../middleware/multer');
const { verifyAccessToken } = require('../utils/auth');
const adminRouter = express.Router();

// Create Role
adminRouter.route("/createRole").post( adminController.createRoleController);
adminRouter.route("/getRole").get(verifyAccessToken, adminController.getRoleController);
adminRouter.route("/updateRole/:id").put(verifyAccessToken, adminController.updateRoleController);
adminRouter.route("/deleteRole/:id").delete(verifyAccessToken, adminController.deleteRoleController);

// Category
adminRouter.route("/createCategory").post(verifyAccessToken, uploads.single("categoryImage"), adminController.createCategoryController)
adminRouter.route("/getCategory").get(verifyAccessToken, adminController.getCategoryController)
adminRouter.route("/updateCategory/:id").put(verifyAccessToken, uploads.single("categoryImage"), adminController.updateCategoryController)
adminRouter.route("/deleteCategory/:id").delete(verifyAccessToken, adminController.deleteCategoryController)


// Sub Category
adminRouter.route("/createSubCategory").post(verifyAccessToken, adminController.createSubCategoryController)
adminRouter.route("/getSubCategory").get(verifyAccessToken, adminController.getSubCategoryController)
adminRouter.route("/updatesubCategory/:id").put(verifyAccessToken, adminController.updateSubCategoryController)
adminRouter.route("/deleteSubCategory/:id").delete(verifyAccessToken, adminController.deletesubCategoryController)


//Product
adminRouter.route("/createProduct").post(verifyAccessToken, uploads.array("productImages"),adminController.createProductController)
adminRouter.route("/getProduct").get(verifyAccessToken, adminController.getProductController)
adminRouter.route("/updateProduct/:id").put(verifyAccessToken, uploads.array("productImages"),adminController.updateProductController)
adminRouter.route("/deleteProduct/:id").delete(verifyAccessToken, adminController.deleteProductController)


adminRouter.route("/login").post(adminController.loginController);

adminRouter.route("/getContact").get(verifyAccessToken, adminController.getContactController);

adminRouter.route("/getProfile").get(verifyAccessToken, adminController.getProfileController);

adminRouter.route("/getBookedProducts").get(verifyAccessToken, adminController.getBookedProductController);

adminRouter.route("/deleteBookedProduct/:id").delete(verifyAccessToken, adminController.deleteBookedProductcontroller);


//filter
adminRouter.route("/createFilter").post(verifyAccessToken, adminController.createFilterController)
adminRouter.route("/getFilter").get(verifyAccessToken, adminController.getFilterController)
adminRouter.route("/updatefilter/:id").put(verifyAccessToken, adminController.updateFilterController)
adminRouter.route("/deleteFilter/:id").delete(verifyAccessToken, adminController.deleteFilterController)


// Events
adminRouter.route("/createEvent").post(verifyAccessToken, uploads.single("bannerImage"), adminController.createEventController)
adminRouter.route("/getEvents").get(verifyAccessToken, adminController.getEventsController)
adminRouter.route("/updateEvent/:id").put(verifyAccessToken, uploads.single("bannerImage"), adminController.updateEventController)
adminRouter.route("/deleteEvent/:id").delete(verifyAccessToken, adminController.deleteEventController)

// Blog
adminRouter.route("/createBlog").post(verifyAccessToken, uploads.single("coverImage"), adminController.createBlogController)
adminRouter.route("/getBlogs").get(verifyAccessToken, adminController.getBlogsController)
adminRouter.route("/updateBlog/:id").put(verifyAccessToken, uploads.single("coverImage"), adminController.updateBlogController)
adminRouter.route("/deleteBlog/:id").delete(verifyAccessToken, adminController.deleteBlogController)


module.exports = adminRouter;