const User = require('../models/model');
const authService = require('../service/auth.service')
const fs = require('fs')
const BlacklistToken = require('../models/blacklistToken')

// Register new user
exports.register = async (req,res) => {
    try{
        console.log('registering user');
        await authService.register(req,res);
    }catch(err){
        console.log(err)
        res.status(err.status).send(err.message)
    }
}

// User LogIn
exports.login = async(req,res) => {
    try{
        console.log('Loggin in user')
        await authService.login(req,res)
    }catch(err) {
        console.log(err)
        res.status(err.status).send(err.message)
    }
}


// Image upload
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have the user ID in the token payload
        const { username, email } = req.body;
        const profilePicture = req.file ? req.file.path : null;

        // Find the user by ID and update the specified fields
        const updatedUser = await User.findOneAndUpdate(
            userId,
            { username, email, profilePicture },
            { new: true } // To return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error!!' });
    }
};


// Removing Profile Picture
exports.removeProfilePicture = async (req, res) => {
    try{
        const userId = req.user.username

        const user = await User.findOneAndUpdate(
            {username: userId},
            {$unset: {profilePicture : 1}},
            {new : true}
        )

        if(user.profilePicture){
            fs.unlinkSync(user.profilePicture)
        }
    }catch(error){
        console.error("Error removing profile picture", error)
        return res.status(500).json({error : "Internal Server Error"})
    }
};

 
// Logout User
// exports.logout = async(req,res) => {
//     try {
//         const token = req.headers.token
//         res.clearCookie('token')
//         return res.status(200).json({message : "Logout Successfull!!"})
//     }catch (err) { 
//         console.error("Error during logout:", err)
//         return res.status(500).json({error : "Internal Server Error"})
//     } 
// } 

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