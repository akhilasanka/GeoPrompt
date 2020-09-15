var express = require('express');
var router = express.Router();
var Locations = require('../model/LocationSchema');
router.post('/locations', function (req, res) {
    Locations.locations.create(req.body, function (err, message) {
        if (err) {
            res.status(500).json({ responseMessage: err.message });
        } else {
            res.status(200).json({ responseMessage: "Successfully created Location" });
        }
    });
});
module.exports = router;