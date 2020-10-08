import React, {Component} from 'react';
import Orientation from 'react-native-orientation';
import Navigator from './navigation/Navigator';
import NotificationHandler from "./notification/NotificationHandler";

export default class App extends Component {

  constructor(props) {
    super(props)
    this.handler = new NotificationHandler(this.onUserClick.bind(this));
  }
  onUserClick(notification) {
      //place holder function for custom behavior when user clicks on the notification.
      console.log("IN APP.js: => ", notification);
  }

  componentDidMount = () => {
    Orientation.lockToPortrait();
  };

  render() {
    return <Navigator />;
  }
}
