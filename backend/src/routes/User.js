var express = require('express');
var router = express.Router();
var Users = require('../model/UserSchema');
router.post('/users', function (req, res) {
    Users.users.create(req.body, function (err, message) {
        if (err) {
            res.status(500).json({ responseMessage: err.message });
        } else {
            res.status(200).json({ responseMessage: "Successfully created user" });
        }
    });
});
module.exports = router;