let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

let passport = require("passport");

// connect to business Model

let business = require("../models/business");


// helper function for guard purposes
function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}


router.get("/", function(req,res,next){
  business.find((err, business) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("business/list",{
        title: "Business",
        business: business,
      });
      
    }
  });
});

/* GET Route for displaying the Add page - CREATE Operation */
router.get("/add", function(req,res,next){
  res.render("business/add", {
    title: "Add Business List",
    //displayName: req.user ? req.user.displayName : "",
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
router.get("/edit/:id", function(req,res,next){
  let id = req.params.id; //id of actual object

  business.findById(id, (err, businesstoedit) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //show the edit view
      res.render("business/edit", {
        title: "Edit Business List",
        business: businesstoedit,
        //displayName: req.user ? req.user.displayName : "",
      });
    }
  });
});

/* POST Route for processing the Edit page - UPDATE Operation */
router.post("/edit/:id", requireAuth, function(req,res,next){
  let id = req.params.id; //id of actual object
  let updatedBusiness = business({
    "name":req.body.name,
    "number":req.body.number,
    "email": req.body.email
  });
  business.updateOne({_id:id}, (err, businesstoedit) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //show the edit view
      res.render("business/edit");
    }
  });
});

/* GET to perform  Deletion - DELETE Operation */
router.get("/delete/:id", requireAuth, function(req,res,next){
  let id = req.params.id;
  Business.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //refresh book list
      res.redirect("/business-list");
    }
  });
});

module.exports = router;