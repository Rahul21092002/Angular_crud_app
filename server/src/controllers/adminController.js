const User = require('../models/model')
const authService = require('../service/auth.service')
const mongoose = require('mongoose')
const BlacklistToken = require('../models/blacklistToken')

// Admin login -------------------------------------------
exports.admin_login = async(req,res) => {
    try{
        console.log('Loggin in user')
        await authService.admin_login(req,res)
    }catch(err) {
        console.log(err)
        res.status(err.status).send(err.message)
    }
}


// Admin get all users -------------------------------------------
exports.get_all_users = async(req,res) => {
    try {
        const users = await User.find()

        if(users.length == 0) {
            return res.status(404).json({
                statusCode : 404,
                status : "success",
                result : [],
                message : "User Not Found"
            })
        }

        return res.status(200).json({
            statusCode : 200,
            status : "Success",
            result : users,
            message : "All users retrieved successfully"
        })

    }catch(error) {
        console.log(error);

        return res.status(500).json({
            statusCode : 500,
            status : "error",
            result : null,
            message : "Internal Server Error"
        })
    }
}


// Admin get a specific user -----------------------------------------
exports.get_user_detail = async(req,res) => {
    try {
        const userId = req.params.id 
        console.log(userId)

        if(!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                statusCode : 400,
                status : "Bad Reques",
                result : null,
                message : "Invalid user ID"
            })
        }

        const user = await User.findById(userId)

        if(!user) {
            return res.status(404).json({
                statusCode : 404,
                status : "Not Found",
                result : null,
                message : "User Not Found!"
            })
        }

        return res.status(200).json({
            statusCode : 200,
            status : "Success",
            result : user,
            message : "User details Retrieved Successfully"
        })
    }
    catch(error) {
        console.log(error)
        return res.status(500).json({
            statusCode : 500,
            status : "Error",
            result : null,
            message : "Internal Server Error"
        })
    }
}


// Admin update user details like file upload and also update username and emails
exports.update_user = async (req, res) => {
    try {
        const userId = req.params.id; // Move this line up
        const { username, email } = req.body;
        console.log(userId)

        if (!userId) {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                result: null,
                message: "Invalid user ID"
            });
        }

        const profilePicture = req.file ? req.file.path : null;

        // Find the user by ID and update the specified fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, profilePicture },
            { new: true } // To return the updated document
        );

        return res.status(200).json({
            statusCode : 200,
            status : "Success",
            result : updatedUser,
            message : "User Details Updated Successfully!"
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            result: null,
            message: "Internal Server Error"
        });
    }
};



// Admin Delete a User
exports.delete_user = async(req,res) => {
    try {
        const userId = req.params.id

        if(!userId) {
            return res.status(400).json({
                statusCode : 400,
                status : "Bad Request",
                result : null,
                message : "Invalid User id"
            })
        }

        const deletedUser = await User.findByIdAndDelete(userId)

        if(!deletedUser) return res.status(404).json({
            statusCode : 404,
            status : "No Result",
            result : null,
            message : "User not found"
        })


        return res.status(200).json({
            statusCode : 200,
            status : "Success",
            result : deletedUser,
            message : "Successfully deleted User!"
        })
    }
    catch(error){
        console.log(error)

        return res.status(500).json({
            statusCode : 500,
            status : "error",
            result : null,
            message : "Internal Server Error"
        })
    }
}


// Admin Logout
const addTokenBlacklist = async(token) => {

    const blacklist = new BlacklistToken({ token : token })
    await blacklist.save()
    console.log("error")
    return
}

exports.logout = async(req,res) => {
    try {
        const token = req.headers.token

        await addTokenBlacklist(token);
        res.clearCookie('token')
        return res.status(200).json({message : "Logout Successfull!!"})
    }catch (err) { 
        console.error("Error during logout:", err)
        return res.status(500).json({error : "Internal Server Error"})
    } 
} 