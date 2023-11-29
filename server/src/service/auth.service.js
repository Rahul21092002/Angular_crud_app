const User = require('../models/model')
const bcrypt = require('bcrypt')
const tokenService = require('./token.service')
const saltRound = 10
 let response ={
    statusCode:"",
    status:"",
    result:[],
    message:""

}
module.exports = {
    register : async (req,res) => {
        try {
            // Destructuring the req.body
            const {username, email, password, confirmPassword} = req.body
        
            // Check if Username already exists
            const userExists = await User.findOne({ username })
            if(userExists) return res.status(403).json("Username Already Exists")

            // Check Email already exists
            const emailExists = await User.findOne({email : req.body.email})
            if(emailExists) return res.status(403).json("Email Already Exists") 
            
            // Check if password and confirm Password matches
            if(password !== confirmPassword) return res.status(400).json('Passwords do not match!')
            
            // Password hashing
            const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRound))

            // creating new user data
            const user = new User({
                username : username,
                email : email,
                password : hashedPassword
            })

            // Saving new user to the db
            const savedUser = await user.save()
            console.log("User registered successfully")

            return res.status(201).json(savedUser)
        }
        catch(err) {
            console.log(err)
            return res.status(500).json('Internal Server Error')
        }
    },

   
     login : async (req, res) => {
        const { username, password } = req.body;
    
        try {
            const user = await User.findOne({ username: username });
    
            if (!user) {
                response.statusCode = 401;
                response.status = "failure";
                response.result = null;
                response.message = "Invalid User";
    
                return res.status(response.statusCode).json(response);
            }
    
            // Checking password given by the user
            if (bcrypt.compareSync(password, user.password)) {
                console.log('User logged in', user);
    
                // Creating jwt token
                let accessToken = await tokenService.getAccessToken(username);
                const expDate = new Date();
                expDate.setHours(expDate.getHours() + 1);
    
                if (accessToken) {
                    response.statusCode = 200;
                    response.status = "success";
                    response.result = {
                        data: {
                            accessToken: accessToken,
                            tokenType: "Bearer",
                            expiresIn: expDate.toISOString(),  // Time in milliseconds
                            createdAt: new Date().toISOString(),  // ISO 8601 format
                        },
                    };
                    response.message = "Login successful";
    
                    return res.status(response.statusCode).json(response);
                }
            } else {
                console.log('user login failed!!', user);
    
                response.statusCode = 400;
                response.status = "failure";
                response.result = null;
                response.message = "Unauthorized: Wrong Password!!";
    
                return res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log(err);
    
            response.statusCode = 500;
            response.status = "failure";
            response.result = null;
            response.message = "Internal Server Error";
    
            return res.status(response.statusCode).json(response);
        }
    }, 

    admin_login : async(req,res) => {
        try {
            let {username, password} = req.body
            let admin = {
                username : "Admin",
                password : "123456"
            }
            
            if(username != admin.username) return res.status(401).json({error : "Invalid User name"})

            if(password != admin.password) return res.status(401).json({error : "Invalid password"})


            let accessToken = await tokenService.getAccessToken(username)
            const expDate = new Date();
            expDate.setHours(expDate.getHours() + 1);

            return res.status(200).json({
                accessToken: accessToken,
                tokenType: "Bearer",
                expiresIn: expDate.toISOString(),  // Time in milliseconds
                createdAt: new Date().toISOString(),  // ISO 8601 format
                message: "Log in successfull!"
            })
        }
        catch (error) {
            console.log(error)
            return res.status(500).json('Internal Server Error')
        }
    }
    


}