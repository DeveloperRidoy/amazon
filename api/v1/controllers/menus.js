const Menu = require('../../../mongodb/models/Menu');
const catchAsync = require('../../../utils/api/catchAsync');
const {getDoc, addDoc, updateDoc, deleteDoc, getDocs} = require('../controllers/handlerFactory');
const AppError = require('./appError');


// @route          GET /api/v1/menus/:id
// @desc           Get menu by id
// @accessibility  Public
exports.getAllMenus = getDocs(Menu);

// @route          GET /api/v1/menus/
// @desc           Get all menus
// @accessibility  Public
exports.getMenu = getDoc(Menu);

// @route          GET /api/v1/menus/menu/:slug
// @desc           Get menu by slug
// @accessibility  Public
exports.getMenuBySlug = catchAsync(async (req, res, next) => {
    const menu = await Menu.findOne({ slug: req.params.slug });
    
    if(menu === null) return next(new AppError(404, 'resource not found'))

    return res.json({
        status: 'success',
        data: {menu}
    })
})

// @route          POST /api/v1/menus/
// @desc           Add a menu
// @accessibility  Private
exports.addMenu = addDoc(Menu)

// @route          PATCH /api/v1/menus/:id
// @desc           Update menu
// @accessibility  Private
exports.updateMenu = updateDoc(Menu);

// @route          DELETE /api/v1/menus/:id
// @desc           Delete menu
// @accessibility  Private
exports.deleteMenu = deleteDoc(Menu);
