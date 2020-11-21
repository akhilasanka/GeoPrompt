import { StyleSheet,ScrollView, View, Text } from 'react-native';
import React, { Component } from 'react';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDoCZjlJjKSxIbwuMLUv4Xg_dySO3Rfynw';

export default class OriginComponent extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          origin:"",
        };
        this.demoMethod = this.demoMethod.bind(this);
      }
    demoMethod(){
       this.props.sendOriginData(this.state.origin);
     }
    render() {
        return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.normal}>Origin </Text>
                <GooglePlacesAutocomplete
                    placeholder='Search Origin'
                    minLength={2} // minimum length of text to search
                    autoFocus={true}
                    returnKeyType={'searchorigin'} // Can be left out for default return key
                    listViewDisplayed={true}    // true/false/undefined
                    fetchDetails={true}
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                        this.setState({origin:data.description})
                        this.demoMethod()
                    }}
                    query={{
                        key: 'AIzaSyDoCZjlJjKSxIbwuMLUv4Xg_dySO3Rfynw',
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