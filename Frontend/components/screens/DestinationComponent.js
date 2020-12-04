import { StyleSheet, ScrollView, View, Text } from 'react-native';
import React, { Component } from 'react';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_PLACES_API_KEY = '';

export default class OriginComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            destination: "",
        };
        this.demoMethod = this.demoMethod.bind(this);
    }
    demoMethod() {
        this.props.sendDestinationData(this.state.destination);
    }
    render() {
        return (
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.normal}>Destination </Text>
                    <GooglePlacesAutocomplete
                        placeholder='Search Destination'
                        minLength={2} // minimum length of text to search
                        autoFocus={true}
                        returnKeyType={'searchdestination'} // Can be left out for default return key
                        listViewDisplayed={true}    // true/false/undefined
                        fetchDetails={true}
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            this.setState({ destination: data.description })
                            this.demoMethod()
                        }}
                        query={{
                            key: '',
                            language: 'en'
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={300}
                    />
                </View>
            </ScrollView>
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