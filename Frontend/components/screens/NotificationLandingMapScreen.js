import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Icon} from 'react-native-elements';

export default class NotificationLandingMapScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Sample Screen',
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
            }}>
            <Marker
              coordinate={{latitude: 37.521799, longitude: -121.979869}}
              title="Joe's House"
              description="Pick up lamp"
            />
            <Marker
              coordinate={{latitude: 37.552799, longitude: -121.999869}}
              title="USPS"
              description="Drop off check"
            />
            <Marker
              coordinate={{latitude: 37.543799, longitude: -121.959869}}
              title="Safeway"
              description="Buy milk at safeway"
            />
          </MapView>
        </View>
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
