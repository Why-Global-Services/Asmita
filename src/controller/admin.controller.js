const categoryServices = require("../services/category/category.services");
const subCategoryServices = require("../services/subcategory/subcategrory.services")
const productServices = require("../services/products/products.services")
const { catchAsync } = require("../utils/catchAsync");
const adminServices = require("../services/admin.services");
const contactServices = require("../services/contact/contact.services");
const filterServices = require("../services/filter/filter.services")
const eventServices = require("../services/events/events.services");
const blogServices = require("../services/blog/blog.services");

const createCategoryController = catchAsync(async(req, res)=>{
    const data = await categoryServices.createCategory(req)
    res.status(201).send(data)
})


const getCategoryController = catchAsync(async(req, res)=>{
    const data = await categoryServices.getCategory(req);
    res.status(200).send(data);
})


const updateCategoryController = catchAsync(async(req, res)=>{
    const data = await categoryServices.updateCategory(req);
    res.status(200).send(data);
})


const deleteCategoryController = catchAsync(async(req, res)=>{
    const data = await categoryServices.deleteCategory(req);
    res.status(200).send(data);
})

const createSubCategoryController = catchAsync(async(req, res)=>{
    const data = await subCategoryServices.createSubCategory(req)
    res.status(201).send(data)
})


const getSubCategoryController = catchAsync(async(req, res)=>{
    const data = await subCategoryServices.getSubCategory(req)
    res.status(201).send(data)
})


const updateSubCategoryController = catchAsync(async(req, res)=>{
    const data = await subCategoryServices.updateSubCategory(req)
    res.status(201).send(data)
})


const deletesubCategoryController = catchAsync(async(req, res)=>{
    const data = await subCategoryServices.deleteSubCategory(req)
    res.status(201).send(data)
})


const createProductController = catchAsync(async(req, res)=>{
    const data = await productServices.createProduct(req)
    res.status(201).send(data)
})


const getProductController = catchAsync(async(req, res)=>{
    const data = await productServices.getProducts(req)
    res.status(201).send(data)
})


const updateProductController = catchAsync(async(req, res)=>{
    const data = await productServices.updateProduct(req)
    res.status(201).send(data)
})


const deleteProductController = catchAsync(async(req, res)=>{
    const data = await productServices.deleteProduct(req)
    res.status(201).send(data)
})


const createRoleController = catchAsync(async (req, res) => {
  const data = await adminServices.createRole(req);
  res.status(200).send(data);
});

const getRoleController = catchAsync(async (req, res) => {
  const data = await adminServices.getRole(req);
  res.status(200).send(data);
});

const updateRoleController = catchAsync(async (req, res) => {
  const data = await adminServices.updateRole(req);
  res.status(200).send(data);
});

const deleteRoleController = catchAsync(async (req, res) => {
  const data = await adminServices.deleteRole(req);
  res.status(200).send(data);
});


const loginController = catchAsync(async (req, res) => {
  const data = await adminServices.login(req);
  res.status(200).send(data);
});

const getContactController = catchAsync(async (req, res) => {
  const data = await contactServices.getContact(req);
  res.status(200).send(data);
});


const getProfileController = catchAsync(async (req, res) => {
  const data = await adminServices.getProfile(req);
  res.status(200).send(data);
});


const getBookedProductController = catchAsync(async (req, res) => {
  const data = await productServices.getBookedProduct(req);
  res.status(200).send(data);
});

const deleteBookedProductcontroller = catchAsync(async (req, res) => {
  const data = await productServices.deleteBookedProduct(req);
  res.status(200).send(data);
});


const createFilterController = catchAsync(async (req, res) => {
  const data = await filterServices.createFilter(req);
  res.status(200).send(data);
});


const getFilterController = catchAsync(async (req, res) => {
  const data = await filterServices.getFilter(req);
  res.status(200).send(data);
});


const updateFilterController = catchAsync(async (req, res) => {
  const data = await filterServices.updateFilter(req);
  res.status(200).send(data);
});

const deleteFilterController = catchAsync(async (req, res) => {
  const data = await filterServices.deleteFilter(req);
  res.status(200).send(data);
});








/* ─── EVENT CONTROLLERS (Admin) ─── */
const createEventController = catchAsync(async (req, res) => {
  const data = await eventServices.createEvent(req);
  res.status(201).send(data);
});

const getEventsController = catchAsync(async (req, res) => {
  const data = await eventServices.getEvents(req);
  res.status(200).send(data);
});

const updateEventController = catchAsync(async (req, res) => {
  const data = await eventServices.updateEvent(req);
  res.status(200).send(data);
});

const deleteEventController = catchAsync(async (req, res) => {
  const data = await eventServices.deleteEvent(req);
  res.status(200).send(data);
});

/* ─── BLOG CONTROLLERS (Admin) ─── */
const createBlogController = catchAsync(async (req, res) => {
  const data = await blogServices.createBlog(req);
  res.status(201).send(data);
});

const getBlogsController = catchAsync(async (req, res) => {
  const data = await blogServices.getBlogs(req);
  res.status(200).send(data);
});

const updateBlogController = catchAsync(async (req, res) => {
  const data = await blogServices.updateBlog(req);
  res.status(200).send(data);
});

const deleteBlogController = catchAsync(async (req, res) => {
  const data = await blogServices.deleteBlog(req);
  res.status(200).send(data);
});

module.exports = {
    createCategoryController,
    getCategoryController,
    updateCategoryController,
    deleteCategoryController,
    createSubCategoryController,
    getSubCategoryController,
    updateSubCategoryController,
    deletesubCategoryController,
    createProductController,
    getProductController,
    updateProductController,
    deleteProductController,
    createRoleController,
    getRoleController,
    updateRoleController,
    deleteRoleController,
    loginController,
    getContactController,
    getProfileController,
    getBookedProductController,
    deleteBookedProductcontroller,
    createFilterController,
    getFilterController,
    updateFilterController,
    deleteFilterController,
    createEventController,
    getEventsController,
    updateEventController,
    deleteEventController,
    createBlogController,
    getBlogsController,
    updateBlogController,
    deleteBlogController,
}