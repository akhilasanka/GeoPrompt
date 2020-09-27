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
