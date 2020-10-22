var express = require('express');
var router = express.Router();
var Tasks = require('../model/TaskSchema');
var ObjectId = require('mongodb').ObjectID;
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDoCZjlJjKSxIbwuMLUv4Xg_dySO3Rfynw'
  });
var distance = require('google-distance-matrix');
distance.key('AIzaSyDoCZjlJjKSxIbwuMLUv4Xg_dySO3Rfynw');
distance.mode('driving');
const { response } = require('express');
  
router.get('/recommendation',  function (req, res) {

        var origins = [req.query.origin];
        var destinations = [req.query.destination];
        var finalPlaces = [];
        var finalPlacesNames = [];
        try{
        distance.matrix(origins, destinations, function (err, distances) {
            if (err) {
                return console.log(err);
            }
            if(!distances) {
                return console.log('no distances');
            }
            if (distances.status == 'OK') {
                for (var i=0; i < origins.length; i++) {
                    for (var j = 0; j < destinations.length; j++) {
                        if (distances.rows[0].elements[j].status == 'OK') {
                            var distance = distances.rows[i].elements[j].distance.value;
                            googleMapsClient.geocode({"address":origins[0]},function(err,response){
                                if(!err){
                                    var originLatLon = response.json.results[0].geometry.location
                                    googleMapsClient.geocode({"address":destinations[0]}, function(err,response){
                                        if(!err){
                                            var destLatLon = response.json.results[0].geometry.location
                                            var Categories = ["gas station","groceries","restaurants"];
                                            for(var i=0;i < Categories.length;i++){
                                                googleMapsClient.placesNearby({"location":originLatLon,"keyword":Categories[i],"radius":distance},function(err,responseMessage){
                                                    if(!err){ 
                                                        var Temp = []
                                                        var names = []
                                                        var results = responseMessage.json.results;
                                                        for(var k=0;k<responseMessage.json.results.length;k++)
                                                        {
                                                            Temp.push(results[k].geometry.location)
                                                            names.push(results[k].name)
                                                        }              
                                                        googleMapsClient.distanceMatrix({"origins":Temp,"destinations":destinations},function(err,response){
                                                            if (!err) {
                                                                var tempFinalArray = finalPlaces
                                                                var namesOfPlaces = finalPlacesNames
                                                                var ans = response.json.rows
                                                                var minimum = 999999;
                                                                var placeNeeded = ""
                                                                var nameOfPlace = ""
                                                                for(var l = 0; l<ans.length; l++)
                                                                {
                                                                    if(ans[l].elements[0].duration.value < minimum){
                                                                        minimum = ans[l].elements[0].duration.value;
                                                                        placeNeeded = response.json.origin_addresses[l];
                                                                        nameOfPlace = names[l]
                    
                                                                    }
                                                                }
                                                                tempFinalArray.push(placeNeeded)
                                                                namesOfPlaces.push(nameOfPlace)
                                                                if(tempFinalArray.length == Categories.length){
                                                                    googleMapsClient.directions({
                                                                        origin: origins[0],
                                                                        destination: destinations[0],
                                                                        waypoints: tempFinalArray,
                                                                        mode: "driving",     
                                                                        }, function(err, response) {
                                                                          if (!err) { 
                                                                            var url = response.requestUrl
                                                                            url = url.replace("https://maps.googleapis.com/maps/api/directions/json?","https://www.google.com/maps/dir/?api=1&")
                                                                          return res.status(200).json({ results: url, placesVisiting: namesOfPlaces});
                                                                          }
                                                                          else{
                                                                            return res.status(204).json({ responseMessage: "Error Getting route with way points" });
                                                                          };
                                                                        });
                                                                }
                                                            }
                                                         
                                                        })
                                                    }
                                                    else{
                                                        return res.status(204).json({ responseMessage: "Error Getting PlacesNearby" });
                                                    }
                                                })                                           
                                            }
                                        }
                                        else{
                                            return res.status(204).json({ responseMessage: "Destination cannot be geocoded" });
                                        }
                                    })
                                }
                                else{
                                    return res.status(204).json({ responseMessage: "Origin cannot be geocoded" });
                                }
                            });
                        } else {
                            return res.status(204).json({ responseMessage: destinations[0] + ' is not reachable by land from ' + origins[0]});
                        }
                    }
                }
            }
        });
    }catch (error) {
        console.log(error);
      }

});

router.get('/tasks', function (req, res) {
    console.log("Inside list tasks API");
    Tasks.tasks.find({ "email": req.query.email, "status": "Pending" }, function (err, results) {
        if (err) {
            res.status(500).json({ responseMessage: err.message });
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
    Tasks.tasks.find({ "userid": req.query.userid, "status": "Completed" }, function (err, results) {
        if (err) {
            res.status(500).json({ responseMessage: err.message });
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

router.get('/uniqueCategories', function (req, res) {
    Tasks.tasks.distinct("categoryName",{"email": req.query.email,status:"Pending"}, function (err, results) {
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
        Tasks.tasks.update({ _id: req.body.itemid }, { $set: { status: "Completed" } }, function (err, message) {
            if (err) {
                res.status(500).json({ responseMessage: err.message });
            } else {
                console.log("Task completed!");
                res.status(200).json({ responseMessage: "Successfully Set Task Status to Complete!" });
            }
        });
    } else {
        res.status(400).json({ responseMessage: "Invalid request" });
    }
});

router.get('/task', function (req, res) {
    console.log("/task get request");
    console.log(req.query);
    Tasks.tasks.find({ "_id": ObjectId(req.query.taskid.replace(/['"]+/g, '')) }, function (err, results) {
        if (err) {
            res.status(500).json({ responseMessage: err.message });
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

router.put("/task", function (req, res) {
    console.log("/task post request");
    console.log(req.body);
    if (req.body != null) {
        const taskData = {
            taskid: req.body.taskid,
            title: req.body.title,
            description: req.body.description,
            categoryName: req.body.categoryName,
            remindbefore: req.body.remindbefore,
        };
        console.log("Task Data:", taskData);
        Tasks.tasks.findOneAndUpdate({ "_id": ObjectId(taskData.taskid.replace(/['"]+/g, '')) }, { $set: { "title": taskData.title, "description": taskData.description, "categoryName": taskData.categoryName, "remindbefore": taskData.remindbefore } }, function (err, message) {
            if (err) {
                res.status(500).json({ responseMessage: err.message });
            } else {
                console.log("Successfully updated task");
                res.status(200).json({ responseMessage: "Successfully updated task" });
            }
        });
    } else {
        res.status(400).json({ responseMessage: "Invalid request" });
    }
});
module.exports = router;