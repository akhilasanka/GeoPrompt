import { StyleSheet, View, Text } from 'react-native';
import React, { Component } from 'react';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDoCZjlJjKSxIbwuMLUv4Xg_dySO3Rfynw';

export default class OriginComponent extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.normal}>Origin </Text>
                <GooglePlacesAutocomplete
                    ref="origin"
                    placeholder="Search"
                    query={{
                        key: GOOGLE_PLACES_API_KEY,
                        language: 'en', // language of the results
                    }}
                    onPress={(data, details = null) => console.log(data)}
                    onFail={(error) => console.error(error)}
                    requestUrl={{
                        url:
                            'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                        useOnPlatform: 'web',
                    }} // this in only required for use on the web. See https://git.io/JflFv more for details.
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    normal: {
        color: 'black',
        fontSize: 18,
        marginBottom: 7,
        fontWeight: '600',
    },
});