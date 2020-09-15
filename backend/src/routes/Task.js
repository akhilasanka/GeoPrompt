var express = require('express');
var router = express.Router();
var Tasks = require('../model/TaskSchema');
router.get('/tasks', function (req, res) {
    Tasks.tasks.find({ "userid": req.query.userid, "status": "Pending"}, function (err, results) {
        if (err){
            res.status(500).json({ responseMessage: err.message  });
        } else {
            if (results.length != 0) {
                res.status(200).json({ results: results });
                }
            else {
                res.status(204).json({ responseMessage: "No results found" });
            }
        }
    });
});
router.post('/tasks', function (req, res) {
    Tasks.tasks.create(req.body, function (err, message) {
        if (err) {
            res.status(500).json({ responseMessage: err.message });
        } else {
            res.status(200).json({ responseMessage: "Successfully created task" });
        }
    });
});
module.exports = router;