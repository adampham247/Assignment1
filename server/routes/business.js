let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

let passport = require("passport");

// connect to business Model

let business = require("../models/Business");


// helper function for guard purposes
function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}
router.get("/business", requireAuth, function(req,res,next){
  business.find((err, Business) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("business/list",{
        title: "Business",
        Business: Business,
        displayName: req.user ? req.user.displayName : "",
      });
      
    }
  });
});

router.get("/", function(req,res,next){
  business.find((err, Business) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("business/list",{
        title: "Business",
        Business: Business,
        displayName: req.user ? req.user.displayName : "",
      });
      
    }
  });
});

/* GET Route for displaying the Add page - CREATE Operation */
router.get("/add", requireAuth, function(req,res,next){
  res.render("business/add", {
    title: "Add Business List",
    displayName: req.user ? req.user.displayName : "",
  });
});

/* POST Route for processing the Add page - CREATE Operation */
router.post("/add", function(req,res,next){
  let newBusiness = business({
    "name": req.body.name,
    "number": req.body.number,
    "email": req.body.email,
  });
  business.create(newBusiness, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the book list
      res.redirect("/business");
    }
  });
});

/* GET Route for displaying the Edit page - UPDATE Operation */
router.get("/edit/:id",requireAuth, function(req,res,next){
  let id = req.params.id; //id of actual object

  business.findById(id, (err, businesstoedit) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //show the edit view
      res.render("business/edit", {
        title: "Business",
        business: businesstoedit,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
});

/* POST Route for processing the Edit page - UPDATE Operation */
router.post("/edit/:id", requireAuth, function(req,res,next){
  let id = req.params.id; //id of actual object
  let updatedBusiness = business({
    "_id":id,
    "name":req.body.name,
    "number":req.body.number,
    "email": req.body.email
  });
  business.updateOne({_id:id}, updatedBusiness,(err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //show the edit view
      res.redirect("/business");
    }
  });
});

/* GET to perform  Deletion - DELETE Operation */
router.get("/delete/:id", requireAuth, function(req,res,next){
  let id = req.params.id;
  business.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //refresh book list
      res.redirect("/business");
    }
  });
});

module.exports = router;