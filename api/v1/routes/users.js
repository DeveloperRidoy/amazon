const express = require('express');
const { protect, restrictTo } = require('../middleware/global');
const Router = express.Router();
const {getAllUsers, getUser, updateUser, deleteUser, updateMe, deleteMe, getUsersByQuery} = require('../controllers/users');
const { login, signup, updatePassword, logout, auth } = require('../controllers/auth');
const { ADMIN } = require('../../../utils/variables');
const { uploadPhoto, resizePhoto } = require('../middleware/multer');


// routes
Router.route('/')
    .get(getAllUsers)

Router.post('/signup', signup)
Router.post('/login', login)
Router.get('/auth', auth)
Router.get('/logout', logout)
Router.patch('/update-password', protect, updatePassword)
Router.patch('/update-me', protect, uploadPhoto, resizePhoto(), updateMe)
Router.delete('/delete-me', protect, deleteMe)

// protect the below routes
Router.use(protect)

Router.post("/query", restrictTo(ADMIN), getUsersByQuery);

Router.route('/:id')
    .get(getUser)
    .patch(restrictTo(ADMIN), updateUser)
    .delete(restrictTo(ADMIN), deleteUser)
 
module.exports = Router;