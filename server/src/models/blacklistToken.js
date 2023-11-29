const mongoose = require('mongoose')

const Schema = new mongoose.Schema( {
    token : {
        type : String,
        require : true,
        unique : true,
    }
})


const BlacklistToken = mongoose.model("BlackListToken", Schema)

module.exports = BlacklistToken