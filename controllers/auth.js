const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // go back one directory so ".."; relative path
// o create a new User in the database -> need to import the User model
const bcrypt = require("bcrypt");


// NOTE: there no routes here yetin server js


router.get('/sign-up', (req, res) =>{
    res.render('auth/sign-up.ejs')
});
// the router object is similar to the app object in server js
// however, it only has router functionality

router.post("/sign-up", async (req, res) => {
    // res.send("Form submission accepted!");
    // check if the user exists - NO DUPLICATE USERNAMES
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.send('Username already taken.');
    }
    // check if password and confirm password are a match?
    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Password and Confirm password do not match!');
    }
    
    // create encryted version of plain-text password (hashed and salted)
    const hashedPassword = bcrypt.hashSync(req.body.password, 10); //higher numbers will take longer for our application when we’re checking a user’s password
    req.body.password = hashedPassword;

// validation logic

    const user = await User.create(req.body);  // creat3e user
    res.send(`Thanks for signing up ${user.username}`);

  });

//   GET /sign-in: send a page that has a login form
  router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
  });

  // POST /sign-in - route that will be used when login form
  // is submitted
  router.post('/sign-in', async(req, res) => {// check to see on guestlist and then c
    const userInDatabase = await User.findOne({username: req.body.username});
    if(!userInDatabase) {
        return res.send('Login Failed. Please try again!');
    }

      const validPassword = bcrypt.compareSync(
          req.body.password,
          userInDatabase.password
      );

      if (!validPassword) {
          return res.send("Login failed. Please try again.");
      }


    //   hwo to start a login session
    //  at this point, we've made it past verificiation
    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
      };

      //   redirect home to homepage
      res.redirect("/");

  });

  
  
  

module.exports = router;