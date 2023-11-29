const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        require : true,
        unique : true
    },
    email: {
        type: String,
        require : true,
        unique : true
    },
    password: {
        type: String,
        require : true,
        // set: (value) => bcrypt.hashSync(value, 10)
    },
    profilePicture : {
        type : String,
    }
})

const User = mongoose.model("User",schema)

module.exports = User