import PushNotification from 'react-native-push-notification';

export default class NotificationHandler {
    constructor(onUserClick) {
        PushNotification.configure({
              onRegister: function(token) {
                console.log('TOKEN:', token)
              },
              onNotification: function(notification) {
                if(!notification.userInteraction) {
                // got a message, so show new notification.
                    PushNotification.localNotification({
                        autoCancel: true,
                        title: notification.title,
                        message: notification.message,
                        vibrate: true,
                        vibration: 300,
                        playSound: true,
                        soundName: 'default'
                    });
                    console.log('GOT PUSH NOTIF ==>', notification)
                } else {
                    console.log("Opening app, the default behavior. Trying to navigate to ListTaskScreen")
                    onUserClick(notification);
                }
              },
              // Android only: GCM or FCM Sender ID
              senderID: '849025990700',
              popInitialNotification: true,
              requestPermissions: true
        });
    }
}