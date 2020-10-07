var express = require('express');
var router = express.Router();
var firebase_admin = require('firebase-admin');
var Tasks = require('../model/TaskSchema');
var foursquare_conf = require("../config/foursquare");
var axios = require('axios');

var serviceAccount = require("../config/firebase_sdk.json");

firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount),
  databaseURL: "https://geoprompt-notifications.firebaseio.com"
});

router.get("/tasksnearby", function(req, res){
    const email = req.query.email;
    const lat = req.query.lat;
    const lon = req.query.lon;
    Tasks.tasks.find({ "email": email, "status": "Pending"}, function (err, results) {
        if (err){
            res.status(500).json({ responseMessage: err.message  });
        } else {
            var cat_task_map = {};
            results.forEach(row => {
                if(row.categoryName in foursquare_conf.category_name_id_map) {
                    const cat_id = foursquare_conf.category_name_id_map[row.categoryName];
                    if (!(cat_id in cat_task_map)) {
                        cat_task_map[cat_id] = [];
                    }
                    cat_task_map[cat_id].push(row);
                }
            });
            const categories_to_fetch = Object.keys(cat_task_map).join(",");
            console.log("Foursquare categories to fetch: " + categories_to_fetch);
            axios.get(foursquare_conf.venues_url, {
                params:{
                    client_id: foursquare_conf.client_id,
                    client_secret: foursquare_conf.client_secret,
                    v:foursquare_conf.version,
                    ll:lat + "," + lon,
                    intent: "browse",
                    radius: foursquare_conf.radius,
                    limit: foursquare_conf.num_results,
                    categoryId: categories_to_fetch
                }
            })
            .then(function (response) {
                const venues = response.data["response"]["venues"];
                var response_data = [];
                venues.forEach(venue => {
                    var tasks_at_venue = new Set();
                    venue.categories.forEach(category => {
                        const id = category.id;
                        if(id in cat_task_map) {
                            tasks_at_venue.add(cat_task_map[id]);
                        }
                    });
                    const venue_data = {
                        "Name": venue.name,
                        "lat": venue.location.lat,
                        "lon": venue.location.lng,
                        "address": venue.location.formattedAddress[0],
                        "tasks": Array.from(tasks_at_venue)
                    };
                    response_data.push(venue_data);
                });
                res.status(200).json({ tasks: response_data });
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ responseMessage: error });
            });
        }
    });
});

router.post('/reportlocation', function (req, res) {
    const email = req.body.email;
    const lat = req.body.lat;
    const lon = req.body.lon;
    const devicetoken = req.body.devicetoken;
    // Use tasks MongoDB & Places API to determine if notification should be sent
    Tasks.tasks.find({ "email": email, "status": "Pending"}, "categoryName", function (err, results) {
        if (err){
            res.status(500).json({ responseMessage: err.message  });
        } else {
            var categoryIds = new Set();
            results.forEach(row => {
                if(row.categoryName in foursquare_conf.category_name_id_map) {
                    categoryIds.add(foursquare_conf.category_name_id_map[row.categoryName]);
                }
            })
            if (categoryIds.size == 0) {
                res.status(200).json({ responseMessage: "No Tasks found to send notifications" });
            } else {
                const categories_to_fetch = Array.from(categoryIds).join(",")
                console.log("Foursquare categories to fetch: " + categories_to_fetch);
                axios.get(foursquare_conf.venues_url, {
                    params:{
                        client_id: foursquare_conf.client_id,
                        client_secret: foursquare_conf.client_secret,
                        v:foursquare_conf.version,
                        ll:lat + "," + lon,
                        intent: "browse",
                        radius: foursquare_conf.radius,
                        limit: foursquare_conf.num_results,
                        categoryId: categories_to_fetch
                    }
                }).then(function (response) {
                    console.log(response);
                    const total_venues = response.data["response"]["venues"].length
                    console.log("Got num venues: " + total_venues);
                    if(total_venues > 0) {
                        var message = {
                            notification: {
                              title: 'Geoprompt: Tasks nearby',
                              body: 'There are tasks you can complete nearby. Click here to open Geoprompt app and see the nearby tasks.'
                            },
                            token: devicetoken
                          };
                          firebase_admin.messaging().send(message)
                            .then((response) => {
                                console.log('Successfully sent message:', response);
                                res.status(200).json({ responseMessage: "Successfully sent notification" });
                            })
                            .catch((error) => {
                                console.log('Error sending message:', error);
                                res.status(500).json({ responseMessage: error });
                            });                
                    } else {
                        res.status(200).json({ responseMessage: "No nearby tasks to complete" });
                    }
                }).catch(function (error) {
                    console.log(error);
                    res.status(500).json({ responseMessage: error });
                });
            }
        }
    });
});

module.exports = router;
