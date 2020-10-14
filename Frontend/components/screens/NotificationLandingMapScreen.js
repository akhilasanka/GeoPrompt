import React from 'react';
import {StyleSheet, View, Platform, Text} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Icon} from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {backendBaseURL} from '../constants/Constants';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

export default class NotificationLandingMapScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Task locations nearby',
    headerLeft: Platform.select({
      ios: (
        <Icon
          name="ios-log-out"
          type="ionicon"
          containerStyle={styles.icon}
          onPress={() => navigation.navigate('LoginScreen')}
        />
      ),
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

  constructor(props) {
    super(props);
    this.state = {
      curLat: null, // initial hardcoded values
      curLon: null, // initial hardcoded values
      taskLocations: [],
      latDelta: 0.0145,
      lonDelta: 0.0145,
    };
    this.updateLocation.bind(this);
  }

  updateLocation(newLat, newLon) {
    // call backend API with new Lat, lon and userid
    AsyncStorage.getItem('user-email').then((email) => {
      axios
        .get(backendBaseURL + '/geoprompt/tasksnearby', {
          params: {email: email, lat: newLat, lon: newLon},
        })
        .then((res) => {
          console.log('BACKEND CALL TO TASKSNEARBY:', res.data.tasks);
          var taskLocations = [];
          res.data.tasks.forEach((location) => {
            console.log(location);
            const numTasks = location.tasks.length;
            if (numTasks > 0) {
              const desc = '' + numTasks + ' task can be completed here.';
              taskLocations.push({
                lat: location.lat,
                lon: location.lon,
                title: location.Name,
                description: desc,
              });
            }
          });
          this.setState({
            curLat: newLat,
            curLon: newLon,
            taskLocations: taskLocations,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  componentDidMount() {
    //todo change this to track current location & call with latest coordinates.
    BackgroundGeolocation.getCurrentLocation(
      (location) => {
        console.log('Inside Notification map screen', location);
        this.updateLocation(location.latitude, location.longitude);
      },
      (error) => {
        console.log('Location services are not available');
      },
    );
  }

  render() {
    var mapView = <Text>No location to show</Text>;
    var i = 0;
    if (this.state.curLat !== null && this.state.curLon !== null) {
      const markers = this.state.taskLocations.map(function (each) {
        console.log(each);
        const coordinate = {latitude: each.lat, longitude: each.lon};
        i = i + 1;
        return (
          <Marker
            key={i}
            coordinate={coordinate}
            title={each.title}
            description={each.description}
          />
        );
      });
      mapView = (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          initialRegion={{
            latitude: this.state.curLat,
            longitude: this.state.curLon,
            latitudeDelta: this.state.latDelta,
            longitudeDelta: this.state.lonDelta,
          }}>
          {markers}
        </MapView>
      );
    }
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <View style={StyleSheet.absoluteFillObject}>{mapView}</View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
