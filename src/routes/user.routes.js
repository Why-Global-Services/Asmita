const express = require('express');
const userRouter = express.Router();
const userController = require("../controller/user.controller")
const eventBlogController = require("../controller/eventBlog.controller")


userRouter.route("/getActiveSubCategory").get(userController.getActiveSubCategoryController)
userRouter.route("/getActiveCategory").get(userController.getActiveCategoryController)
userRouter.route("/getActiveProducts/:id").get(userController.getActiveProductsController)

userRouter.route("/getAllActiveProducts").get(userController.getAllActiveProductsController)


userRouter.route("/createContact").post(userController.createContactController);

userRouter.route("/getProductsBasedOnCategory/:id").get(userController.getActiveProdutsBasedOnCategroyController);

userRouter.route("/bookProductForm").post(userController.bookProductFormController);

// Events (public)
userRouter.route("/getActiveEvents").get(eventBlogController.getActiveEventsController);
userRouter.route("/getEventById/:id").get(eventBlogController.getEventByIdController);

// Blog (public)
userRouter.route("/getActiveBlogs").get(eventBlogController.getActiveBlogsController);
userRouter.route("/getBlogBySlug/:slug").get(eventBlogController.getBlogBySlugController);
userRouter.route("/getBlogById/:id").get(eventBlogController.getBlogByIdController);

module.exports = userRouter;