const categoryServices = require("../services/category/category.services");
const subCategoryServices = require("../services/subcategory/subcategrory.services")
const productServices = require("../services/products/products.services")
const contactServices = require("../services/contact/contact.services")
const { catchAsync } = require("../utils/catchAsync");

const getActiveCategoryController = catchAsync(async(req, res)=>{
    const data = await categoryServices.getActiveCategory(req);
    res.status(200).send(data);
});


const getActiveSubCategoryController = catchAsync(async(req, res)=>{
    const data = await subCategoryServices.getActiveSubCategory(req);
    res.status(200).send(data);
});


const getActiveProductsController = catchAsync(async(req, res)=>{
    const data = await productServices.getActiveProducts(req);
    res.status(200).send(data);
})

const getAllActiveProductsController = catchAsync(async(req, res)=>{
    const data = await productServices.getAllActiveProducts(req);
    res.status(200).send(data);
})


const createContactController = catchAsync(async(req, res)=>{
    const data = await contactServices.createContactUs(req);
    res.status(200).send(data);
})


const getActiveProdutsBasedOnCategroyController = catchAsync(async(req, res)=>{
    const data = await productServices.getActiveProdutsBasedOnCategroy(req);
    res.status(200).send(data);
})

const bookProductFormController = catchAsync(async(req, res)=>{
    const data = await productServices.bookProductForm(req);
    res.status(200).send(data);
})


module.exports = {
    getActiveCategoryController,
    getActiveSubCategoryController,
    getActiveProductsController,
    createContactController,
    bookProductFormController,
    getActiveProdutsBasedOnCategroyController,
    getAllActiveProductsController
}