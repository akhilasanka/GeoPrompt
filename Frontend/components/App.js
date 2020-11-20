import React, {Component} from 'react';
import Orientation from 'react-native-orientation';
import Navigator from './navigation/Navigator';
import {StatusBar, View} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    Orientation.lockToPortrait();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#44ABEB" barStyle="default" />
        <Navigator />
      </View>
    );
  }
}
