const express = require('express');
const Menu = require('../../../mongodb/models/Menu');
const { getAllMenus, getMenu, addMenu, updateMenu, getMenuBySlug, deleteMenu } = require('../controllers/menus');
const { checkDoc } = require('../middleware/global');
const Router = express.Router();


Router.route('/')
    .get(getAllMenus)
    .post(addMenu)

Router.route('/:id')
    .all(checkDoc(Menu))
    .get(getMenu)
    .patch(updateMenu)
    .delete(deleteMenu)

Router.route('/menu/:slug')
    .get(getMenuBySlug)


module.exports = Router;