const { bookProduct } = require("../../models/bookProduct.model");
const { filter } = require("../../models/filter.model");
const { products } = require("../../models/product.model");
const { subCategory } = require("../../models/subcategory.model");
const ApiError = require("../../utils/apiError");
const { uploadToCloud } = require("../../utils/uploadFileToS3");

const createProduct = async (req) => {
  const { body } = req;

  // ✅ 1️⃣ Role-based access
  if (!["superAdmin", "admin"].includes(req.user.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  // ✅ 2️⃣ File validation
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No product images provided");
  }

  if (req.files.length > 4) {
    throw new ApiError(400, "You can upload a maximum of 4 images");
  }

  // ✅ 3️⃣ Basic field validation
  if (!body.productTitle?.trim()) {
    throw new ApiError(400, "No product title provided");
  }

  if (!body.categoryId) {
    throw new ApiError(400, "No category ID provided");
  }

  // ✅ 4️⃣ Check for duplicate product
  const existingProduct = await products.findOne({
    name: { $regex: `^${body.productTitle}$`, $options: "i" },
  });

  if (existingProduct) {
    throw new ApiError(400, "Product title already exists");
  }

  // ✅ 5️⃣ Upload images safely
  const result = await Promise.allSettled(
    req.files.map(async (image) => {
      const key = `Product/THEERA_${Date.now()}_${image.originalname}`;
      const imageURL = await uploadToCloud(image, key);
      return imageURL;
    })
  );

  const imageURLs = result
    .filter((res) => res.status === "fulfilled")
    .map((res) => res.value);

  // ✅ Optional: Handle upload errors
  const failedUploads = result.filter((res) => res.status === "rejected");
  if (failedUploads.length > 0 && imageURLs.length === 0) {
    throw new ApiError(500, "All image uploads failed");
  }

  // ✅ 6️⃣ Create product
  const createdProduct = await products.create({
    ...body,
    name: body.productTitle,
    productImages: imageURLs,
  });

  return {
    success: true,
    message: "Product created successfully",
    data: createdProduct,
  };
};


const getProducts = async (req) => {
  if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  const fetchedProducts = await products.find();

  if (fetchedProducts.length === 0) {
    throw new ApiError(404, "No pdoucts found");
  }

  return {
    success: true,
    message: "Products fetched successfully",
    data: fetchedProducts,
  };
};

const updateProduct = async (req) => {
  const { body } = req;
  const id = req.params.id;

  // 1️⃣ Role check
  if (!["superAdmin", "admin"].includes(req.user.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  // 2️⃣ Check if product exists
  const existingProduct = await products.findById(id);
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  // 3️⃣ Prevent duplicate title conflict (except itself)
  if (body.productTitle) {
    const existingProductCheck = await products.findOne({
      _id: { $ne: id },
      name: { $regex: `^${body.productTitle}$`, $options: "i" },
    });

    if (existingProductCheck) {
      throw new ApiError(400, "Product title already exists");
    }
  }

  // 4️⃣ Handle image uploads (replace DB images if new ones provided)
  let imageURLs = existingProduct.productImages || [];

  if (req.files && req.files.length > 0) {
    const result = await Promise.allSettled(
      req.files.map(async (image) => {
        const key = `Product/THEERA_${Date.now()}_${image.originalname}`;
        const imageURL = await uploadToCloud(image, key);
        return imageURL;
      })
    );

    imageURLs = result
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    const failedUploads = result.filter((r) => r.status === "rejected");
    if (failedUploads.length > 0) {
      console.warn(`⚠️ ${failedUploads.length} image(s) failed to upload`);
    }
  }

  // 5️⃣ Prepare updated data
  const updateData = {
    ...body,
    name: body.productTitle || existingProduct.name,
    productImages: imageURLs.length > 0 ? imageURLs : existingProduct.productImages, // ✅ Replace only if new images uploaded
    updatedAt: new Date(),
  };

  // 6️⃣ Update product
  const updatedProduct = await products.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedProduct) {
    throw new ApiError(404, "Product update failed");
  }

  return {
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  };
};



const deleteProduct = async (req) => {
  const id = req.params.id;

  if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  if (!id) {
    throw new ApiError(400, "No product id provided");
  }

  const deletedProduct = await products.findByIdAndDelete({ _id: id });

  if (!deletedProduct) {
    throw new ApiError(404, "No product found to delete");
  }

  return {
    success: true,
    message: "Product deleted Successfully",
    data: deletedProduct,
  };
};

const getActiveProdutsBasedOnCategroy = async(req)=> {
  const id = req.params.id;

  const productsData = await products.aggregate([
    {
      $match:{ status: true, categoryId: id}
    }
  ]);

  const filterData = await filter.aggregate([
    {
      $match: {categoryId: id}
    }
  ])

  const data = {productsData, filterData}

  return {
    success: true,
    message: "Active data fetched successfully",
    data: data,
  };
}

const getActiveProducts = async (req) => {
  const id = req.params.id;
  const activeProducts = await products.aggregate([
  { $match: { status: true } },

  // split mainProduct and keep categoryId available
  {
    $facet: {
      mainProduct: [
        { $match: { _id: id } },
        { $limit: 1 }
      ],
      allProducts: [
        { $match: { } } // will filter later
      ]
    }
  },

  // flatten mainProduct
  {
    $project: {
      mainProduct: { $arrayElemAt: ["$mainProduct", 0] },
      allProducts: 1
    }
  },

  // now filter otherProducts using $filter + mainProduct.categoryId
  {
    $project: {
      mainProduct: 1,
      otherProducts: {
        $filter: {
          input: "$allProducts",
          as: "p",
          cond: {
          $and: [
            { $eq: ["$$p.categoryId", "$mainProduct.categoryId"] },
            { $ne: ["$$p._id", "$mainProduct._id"] }
          ]
        }

        }
      }
    }
  }
]
);

  return {
    success: true,
    message: "Active data fetched successfully",
    data: activeProducts,
  };
};

const getAllActiveProducts = async(req) =>{
  const allProducts = await products.aggregate([
    {
      $match: {status: true}
    }
  ])

  if(!allProducts){
    throw new ApiError(400, "No products found")
  }

  return {success: true, message: "All active products fetched successfully", data: allProducts}
}



const bookProductForm = async (req) => {
  const { body } = req;

  // Validate all required fields
  const requiredFields = [
    "name",
    "phoneNumber",
    "email",
    "categoryId",
    "categoryTitle",
    "subCategoryId",
    "subCategoryTitle",
    "productId",
    "productTitle",
  ];

  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  const createdContact = await bookProduct.create(body);

  return {
    success: true,
    message: "Contact created successfully",
    data: createdContact,
  };
};

const getBookedProduct = async(req)=>{
  const getBookedProductData = await bookProduct.aggregate([
  {
    $lookup: {
      from: "Products",
      localField: "productId",
      foreignField: "_id",
      as: "product"
    }
  },
  {
    $unwind: {
      path: "$product",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $project: {
      name:1,
      phoneNumber:1,
      email:1,
      message:1,
      productTitle: "$product.productTitle",
      productImage: "$product.productImages",
      categoryTitle:1,
      subCategoryTitle: 1,
      subCategoryId:1,
      categoryId: 1,
      productId: 1
      
    }
  }
])

return {success: true, message: "Fetched Booked products", data:getBookedProductData }
}


const deleteBookedProduct = async(req)=>{
  const id = req.params.id;

  if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  const deletedProduct = await bookProduct.findByIdAndDelete({_id:id})

  return {success: true, message: "Order Deleted successfully", data: deletedProduct}

}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getActiveProducts,
  bookProductForm,
  getActiveProdutsBasedOnCategroy,
  getBookedProduct,
  getAllActiveProducts,
  deleteBookedProduct,
};
