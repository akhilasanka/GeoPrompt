var express = require('express');
var router = express.Router();
var Tasks = require('../model/TaskSchema');
var ObjectId = require('mongodb').ObjectID;
router.get('/tasks', function (req, res) {
    console.log("Inside list tasks API");
    Tasks.tasks.find({ "email": req.query.email, "status": "Pending"}, function (err, results) {
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
router.post("/task", function (req, res) {
    console.log("/task post request");
    console.log(req.body);
    if (req.body != null) {
        const taskData = {
            title: req.body.title,
            description: req.body.description,
            email: req.body.email,
            status: "Pending",
            categoryName: req.body.categoryName,
            remindbefore: req.body.remindbefore,
        };
        console.log("Task Data:", taskData);
        Tasks.tasks.create(taskData, function (err, message) {
            if (err) {
                res.status(500).json({ responseMessage: err.message });
            } else {
                console.log("Successfully created task");
                res.status(200).json({ responseMessage: "Successfully created task" });
            }
        });
    } else {
        res.status(400).json({ responseMessage: "Invalid request" });
    }
});
router.get('/completedTasks', function (req, res) {
    Tasks.tasks.find({ "userid": req.query.userid, "status": "Completed"}, function (err, results) {
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
router.post("/taskComplete", function (req, res) {
    console.log("/task post request");
    console.log(req.body);
    if (req.body != null) {
        console.log("Task Data:", req.body);
        Tasks.tasks.update({ _id: req.body.itemid },{$set:{status:"Completed"}},function (err, message) {
            if (err) {
                res.status(500).json({ responseMessage: err.message });
            } else {
                console.log("Task completed!");
                res.status(200).json({ responseMessage: "Successfully created task" });
            }
        });
    } else {
        res.status(400).json({ responseMessage: "Invalid request" });
    }
});
module.exports = router;