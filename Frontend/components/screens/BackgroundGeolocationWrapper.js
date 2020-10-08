import React, {PureComponent} from 'react';
import Orientation from 'react-native-orientation';
import {Alert, View} from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {onLogout} from '../menu/Logout';

export default class BackgroundGeolocationWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      locations: [],
      stationaries: [],
      isRunning: false,
      authChecked: false,
    };
  }

  componentWillUnmount = () => {
    BackgroundGeolocation.events.forEach((event) =>
      BackgroundGeolocation.removeAllListeners(event),
    );
  };

  componentDidMount = () => {
    const {navigation} = this.props;
    Orientation.lockToPortrait();

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 0,
      distanceFilter: 0,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      startOnBoot: false,
      stopOnTerminate: true,
      interval: 5000,
      fastestInterval: 5000,
      activitiesInterval: 1000,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.getCurrentLocation(
      (lastLocation) => {
        let region = this.state.region;
        const latitudeDelta = 0.01;
        const longitudeDelta = 0.01;
        region = Object.assign({}, lastLocation, {
          latitudeDelta,
          longitudeDelta,
        });
        this.setState({locations: [lastLocation], region});
      },
      (error) => {
        console.log('Location services are not available');
      },
    );

    BackgroundGeolocation.on('start', () => {
      // service started successfully
      // you should adjust your app UI for example change switch element to indicate
      // that service is running
      console.log('[DEBUG] BackgroundGeolocation has been started');
      this.setState({isRunning: true});
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[DEBUG] BackgroundGeolocation has been stopped');
      this.setState({isRunning: false});
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );
      if (
        status !== BackgroundGeolocation.AUTHORIZED &&
        !this.state.authChecked
      ) {
        // we need to set delay after permission prompt or otherwise alert will not be shown
        setTimeout(
          () =>
            Alert.alert(
              'App requires location tracking',
              'App requires location tracking. Please enable location tracking and launch the application to continue',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    onLogout();
                    navigation.navigate('LoginScreen');
                  },
                },
              ],
            ),
          1000,
        );
        this.setState({authChecked: true});
      }
    });

    BackgroundGeolocation.on('error', ({message}) => {
      Alert.alert('BackgroundGeolocation error', message);
    });

    BackgroundGeolocation.on('location', (location) => {
      console.log('[DEBUG] Movement BackgroundGeolocation location', location);
      console.log('Lattitude: ', location.latitude);
      console.log('Longitude: ', location.longitude);
      BackgroundGeolocation.startTask((taskKey) => {
        requestAnimationFrame(() => {
          const longitudeDelta = 0.01;
          const latitudeDelta = 0.01;
          const region = Object.assign({}, location, {
            latitudeDelta,
            longitudeDelta,
          });
          const locations = this.state.locations.slice(0);
          locations.push(location);
          this.setState({locations, region});
          console.log(
            '[DEBUG] List of locations so far ',
            this.state.locations,
          );
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });

    BackgroundGeolocation.on('stationary', (location) => {
      console.log(
        '[DEBUG] Stationary BackgroundGeolocation stationary',
        location,
      );
      BackgroundGeolocation.startTask((taskKey) => {
        requestAnimationFrame(() => {
          if (location.radius) {
            const longitudeDelta = 0.001;
            const latitudeDelta = 0.001;
            const region = Object.assign({}, location, {
              latitudeDelta,
              longitudeDelta,
            });
            const stationaries = this.state.stationaries.slice(0);
            stationaries.push(location);
            this.setState({stationaries, region});
          }
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.checkStatus(({isRunning}) => {
      this.setState({isRunning});
    });
    BackgroundGeolocation.start();
  };

  render() {
    return <View></View>;
  }
}
