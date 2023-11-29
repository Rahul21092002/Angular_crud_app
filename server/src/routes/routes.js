const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const adminController = require('..//controllers/adminController')
const jwtAuth = require('../middleware/jwtAuth')
const upload = require('../service/profileUpload.service')
const VerifyBlackList = require('../middleware/BlackListAuth')


// User Api -----

// User LogIn
router.post('/login', userController.login)
// User SignUp
router.post('/register',userController.register)
// User logout
router.post('/logout',VerifyBlackList,  jwtAuth, userController.logout)
// User Image Upload
router.put('/profileUpdate',VerifyBlackList,  jwtAuth, upload.single('profilePicture'), userController.updateProfile) // Don't forget to add jwtAuth middleware
// Remove image 
router.delete('/removeProfilePicture',VerifyBlackList,  jwtAuth, userController.removeProfilePicture)



// Admin Api ----

// Admin login
router.post('/admin/login',adminController.admin_login)
// Admin user details
router.get('/admin/user_details',VerifyBlackList,  jwtAuth, adminController.get_all_users)
// // Admin user details
router.get('/admin/get_user/:id',VerifyBlackList,  jwtAuth, adminController.get_user_detail)
// Admin specific user details
router.put('/admin/update_user/:id',VerifyBlackList,  jwtAuth, upload.single('profilePicture'), adminController.update_user)
// Admin delete user
router.delete('/admin/delete_user/:id',VerifyBlackList, jwtAuth, adminController.delete_user)
// Admin Logout 
router.post('/admin/logout', VerifyBlackList, jwtAuth, adminController.logout)



module.exports = router