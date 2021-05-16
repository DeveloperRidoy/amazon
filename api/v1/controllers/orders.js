const Order = require("../../../mongodb/models/Order");
const {
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  deleteManyDocs,
  updateManyDocs,
} = require("../controllers/handlerFactory");

// @route          GET /api/v1/orders/:id
// @desc           Get order by id
// @accessibility  Public
exports.getAllOrders = getDocs(Order);

// @route          GET /api/v1/orders/
// @desc           Get all orders
// @accessibility  Public
exports.getOrder = getDoc(Order);

// @route          POST /api/v1/orders/
// @desc           Add a order
// @accessibility  Private
exports.addOrder = addDoc(Order);

// @route          PATCH /api/v1/orders/:id
// @desc           Update order
// @accessibility  Private
exports.updateOrder = updateDoc(Order);

// @route          DELETE /api/v1/orders/:id
// @desc           Delete order
// @accessibility  Private
exports.deleteOrder = deleteDoc(Order);

// @route          DELETE /api/v1/orders/
// @desc           Delete many orders
// @accessibility  Private
exports.deleteManyOrders = deleteManyDocs(Order);

// @route          PATCH /api/v1/orders/
// @desc           update many orders
// @accessibility  Private
exports.updateManyOrders = updateManyDocs(Order);
