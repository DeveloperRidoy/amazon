const Product = require("../../../mongodb/models/Product");
const catchAsync = require("../../../utils/api/catchAsync");
const {
  deleteDoc,
  getDoc,
  addDoc,
  updateDoc,
  getDocs,
} = require("./handlerFactory");

// @route          POST /api/v1/Products/
// @desc           Add a Product
// @accessibility  Private
exports.addProduct = addDoc(Product)

// @route          GET /api/v1/Products/
// @desc           Get all Products
// @accessibility  Public
exports.getAllProducts = getDocs(Product);

// @route          GET /api/v1/Products/:id
// @desc           Get Product by id
// @accessibility  Public
exports.getProduct = getDoc(Product);

// @route          DELETE /api/v1/Products/:id
// @desc           Delete Product by id
// @accessibility  Public
exports.deleteProduct = deleteDoc(Product);

// @route          PATCH /api/v1/Products/:id
// @desc           Update Product
// @accessibility  Private
exports.updateProduct = updateDoc(Product);

// @route          GET /api/v1/products/product/:slug
// @desc           Get product by slug
// @accessibility  Public
exports.getProductBySlug = catchAsync(async (req, res, next) => {
    const product = await product.findOne({ slug: req.params.slug });
    
    if(product === null) return next(new AppError(404, 'resource not found'))

    return res.json({
        status: 'success',
        data: {product}
    })
})