var express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var router = express.Router();
var Users = require("../model/UserSchema");
router.post("/users", function (req, res) {
  Users.users.create(req.body, function (err, message) {
    if (err) {
      res.status(500).json({ responseMessage: err.message });
    } else {
      res.status(200).json({ responseMessage: "Successfully created user" });
    }
  });
});

router.post("/signup", function (req, res) {
  console.log("Inside signup API");
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  Users.users.findOne({ email: email }, (err, user) => {
    if (err) {
      console.log("Unable to fetch user details.", err);
      res
        .status(500)
        .json({ responseMessage: "Unable to fetch user details." });
    } else {
      if (user) {
        console.log("User Already Exists!", user);
        res.status(409).json({ success: false, responseMessage: "User Already Exists!" });
      } else {
        let hashedPassword = bcrypt.hashSync(password, 2);
        var newUser = new Users.users({
          email: email,
          password: hashedPassword,
          firstname: firstname,
          lastname: lastname,
        });
        newUser.save().then(
          (doc) => {
            console.log("User saved successfully.", doc);
            res
              .status(200)
              .json({ success: true, responseMessage: "User saved successfully." });
          },
          (err) => {
            console.log("Unable to save user details.", err);
            res
              .status(500)
              .json({ success: false, responseMessage: "Unable to save user details." });
          }
        );
      }
    }
  });
});

router.post("/signin", function (req, res) {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  Users.users.findOne(
    {
      email: email,
    },
    (err, user) => {
      if (err) {
        res.status(500).json({ responseMessage: "Sign In Failed" });
      } else {
        if (user && bcrypt.compareSync(password, user.password)) {
          var token = {
            isLoggedIn: true,
            email: user.email,
          };
          var signed_token = jwt.sign(token, "cmpe295b_geoprompt_node", {
            expiresIn: 15780000, // in seconds
          });
          res
            .status(200)
            .json({
              responseMessage: "Sign In Success",
              token: signed_token,
              firstname: user.firstname,
              email: user.email,
            });
        } else {
          res.status(401).json({ responseMessage: "Invalid Credentials" });
        }
      }
    }
  );
});

module.exports = router;
