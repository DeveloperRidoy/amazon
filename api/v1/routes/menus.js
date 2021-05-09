const express = require('express');
const { getAllMenus, getMenu, addMenu, updateMenu, getMenuBySlug, deleteMenu } = require('../controllers/menus');
const Router = express.Router();


Router.route('/')
    .get(getAllMenus)
    .post(addMenu)

Router.route('/:id')
    .get(getMenu)
    .patch(updateMenu)
    .delete(deleteMenu)

Router.route('/menu/:slug')
    .get(getMenuBySlug)


module.exports = Router;