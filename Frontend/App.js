/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

export default class App extends React.Component {
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
});
