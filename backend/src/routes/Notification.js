var express = require('express');
var router = express.Router();
var firebase_admin = require('firebase-admin');

var serviceAccount = require("../config/firebase_sdk.json");

firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount),
  databaseURL: "https://geoprompt-notifications.firebaseio.com"
});

router.post('/reportlocation', function (req, res) {
    const userid = req.body.userid;
    const lat = req.body.lat;
    const lon = req.body.lon;
    const devicetoken = req.body.devicetoken;
    // Use tasks MongoDB & Places API to determine if notification should be sent

    //todo change this once places API is integrated.
    var should_notify = true;

    // Call FireBase SDK to notify the devicetoken.
    if(should_notify) {
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
    }
});

module.exports = router;
