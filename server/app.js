const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config() // Load environment variable from .env file
const connectDB = require('./src/config/db')
const morgan = require('morgan')

// Create an express application
const app = express()

// Mongodb connection using mongoose
connectDB()

// Middlewares
app.use(express.json()) // Parse JSON request
app.use(express.urlencoded({extended : false})) // Parse URL requests  
app.use(cors()) // Enable cors for all routes  

// Error handling middleware 
app.use((err,req,res,next) => {
    console.error(err.stack) 
    res.status(500).send('Something went wrong')
})

// Frontend static file 
app.use(express.static("client"))

// Morgan Middle ware logs request details
app.use(morgan('dev'));
 
// Home route
app.use('/', require('./src/routes/routes'))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)  
}) 