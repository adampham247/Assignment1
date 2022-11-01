var express = require('express');
var router = express.Router();
let mongoose = require("mongoose");
let userModel = require("../models/user");
let User = userModel.User;

let passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET About Us page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Us' });
});

/* GET Projects page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});

/* GET Services page. */
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services' });
});


/* GET Contact Us page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});
/* GET Business page. */
router.get('/business', function(req, res, next) {
  res.render('business/list', { title: 'Business' });
});


/* GET Route for displaying the Login page */
router.get('/login', function(req, res, next) {
  if (!req.user) {
    res.render("auth/login", {
      title: "Login",
      messages: req.flash("loginMessage"),
      /*displayName: req.user ? req.user.displayName : "",*/
    });
  } else {
    return res.redirect("/");
  }
});


/* POST Route for processing the Login page */
router.post("/login", function(req, res, next){
  passport.authenticate("local", (err, user, info) => {
    // server err?
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("loginMessage", "Authentication Error");
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      // server error?
      if (err) {
        return next(err);
      }
      return res.redirect("/contact-list");
    })
    })});

    router.post("/login",function(req, res, next){
      passport.authenticate("local", (err, user, info) => {
        // server err?
        if (err) {
          return next(err);
        }
        // is there a user login error?
        if (!user) {
          req.flash("loginMessage", "Authentication Error");
          return res.redirect("/login");
        }
        req.login(user, (err) => {
          // server error?
          if (err) {
            return next(err);
          }
          return res.redirect("/contact-list");
        });
      })(req, res, next)
    });



/* GET Route for displaying the Register page */
router.get("/register", function(req, res, next){
  res.render("auth/register", { title: 'Register' });
});


/* POST Route for processing the Register page */
router.post("/register", function(req,res,next){
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password
    email: req.body.email,
    displayName: req.body.displayName,
  });

  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log("Error: Inserting New User");
      if (err.name == "UserExistsError") {
        req.flash(
          "registerMessage",
          "Registration Error: User Already Exists!"
        );
        console.log("Error: User Already Exists!");
      }
      return res.render("auth/register", {
        title: "Register",
        messages: req.flash("registerMessage"),
        /* displayName: req.user ? req.user.displayName : "",*/
      });
    } else {
      // if no error exists, then registration is successful

      // redirect the user and authenticate them

      return passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
});


/* GET to perform UserLogout */
router.get("/logout", function(req,res,next){
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
