import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default class NotificationLandingMap extends React.Component {
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
          >
          <Marker coordinate={{ latitude: 37.521799, longitude: -121.979869 }} title="Joe's House" description="Pick up lamp"/>
          <Marker coordinate={{ latitude: 37.552799, longitude: -121.999869 }} title="USPS" description="Drop off check"/>
          <Marker coordinate={{ latitude: 37.543799, longitude: -121.959869 }} title="Safeway" description="Buy milk at safeway"/>
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
});