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
      latDelta: 0.029,
      lonDelta: 0.029,
      locationCounter: 0,
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
          this.setState(
            {
              curLat: newLat,
              curLon: newLon,
              taskLocations: taskLocations,
            },
            this.goToInitialLocation,
          );
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  roundNum = (num) => {
    return Math.round(num * 100000) / 100000;
  };

  componentDidMount() {
    this.updateGPSLocation();
    setInterval(this.updateGPSLocation, 3000);
    setInterval(() => this.setState({locationCounter: 0}), 60000);
  }

  updateGPSLocation = () => {
    BackgroundGeolocation.getCurrentLocation(
      (location) => {
        if (
          this.state.locationCounter >= 20 ||
          (this.state.curLat &&
            this.state.curLon &&
            this.roundNum(location.latitude) ===
              this.roundNum(this.state.curLat) &&
            this.roundNum(location.longitude) ===
              this.roundNum(this.state.curLon))
        ) {
          return;
        } else {
          console.log(
            '================= updating location counter: ' +
              this.state.locationCounter +
              ' =================',
          );
          this.setState((prevState, props) => ({
            locationCounter: prevState.locationCounter + 1,
          }));
          this.updateLocation(location.latitude, location.longitude);
        }
      },
      (error) => {
        console.log('Location services are not available');
      },
    );
  };

  goToInitialLocation = () => {
    let initialRegion = Object.assign(
      {},
      {
        latitude: this.state.curLat,
        longitude: this.state.curLon,
        latitudeDelta: this.state.latDelta,
        longitudeDelta: this.state.lonDelta,
      },
    );
    this.mapView.animateToRegion(initialRegion, 1000);
  };

  render() {
    var mapView = <Text>...</Text>;
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
      console.log('================= rerendering map =================');
      mapView = (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          followUserLocation={true}
          zoomEnabled={true}
          zoomControlEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={this.goToInitialLocation}
          ref={(ref) => (this.mapView = ref)}
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
    flex: 1,
    marginLeft: 1,
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
