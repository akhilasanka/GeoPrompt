import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Icon, Button} from 'react-native-elements';

export default class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Home',
    headerLeft: Platform.select({
      ios: null,
      android: (
        <Icon
          name="md-menu"
          type="ionicon"
          containerStyle={styles.icon}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  });

  _onPressButton = () => {
    this.props.navigation.navigate('AddReminderScreen');
  };

  _onPressListTasksButton = () => {
      this.props.navigation.navigate('ListTaskScreen');
    };

  render() {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <View style={StyleSheet.absoluteFillObject}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={{
              latitude: 37.560799,
              longitude: -121.979869,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
        <View style={styles.mapLabelContainer}>
          <Text style={styles.mapLabel}>
            GeoPrompt - A Location Based Task Reminder Service
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressListTasksButton}
            title="List Tasks"
            color="#841584"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressButton}
            title="Add Reminder"
            color="#841584"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    left: 30,
    right: 30,
    top: 30,
    bottom: 200,
  },
  mapLabelContainer: {
    position: 'absolute',
    bottom: 150,
    left: 30,
    flex: 1,
  },
  mapLabel: {
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  buttonContainer: {
    top: 550,
    margin: 20,
  },
  icon: {
    padding: 10,
  },
});
