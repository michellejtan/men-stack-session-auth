// dependencies
const dotenv = require("dotenv");

const express = require("express");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const authController = require("./controllers/auth.js"); // relative path
const session = require('express-session');

// intialize express app
const app = express();


// configure settings
dotenv.config();
const port = process.env.PORT || "3000";  // catch when we deploy it
// Set the port from environment variable or default to 3000
// const port = process.env.PORT ? process.env.PORT : "3000"; //Dan feel this is word, ternary operator, 3 operamd

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// mount middleware
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // more efficient to be false instead of true
}));

// fun fact!
app.use('/auth', authController);
// any HTTP requests from the brower that come to /auth...
// will automatically be forward to the router cide
// inside of the 

// mount routes
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});


// tell the app to listen for HHTP requests
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});