import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Alert } from 'react-native';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import OriginComponent from './OriginComponent';
import { Icon } from 'react-native-elements';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDoCZjlJjKSxIbwuMLUv4Xg_dySO3Rfynw';

export default class GetRouteScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Complete tasks on your way',
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
    handleSubmit = async () => {
        console.log('Get Optimized routes');
    }
    render() {
        return (
            <View style={styles.container}>
                <OriginComponent />
                <Text style={styles.normal}>Destination </Text>
                <GooglePlacesAutocomplete
                    ref="destination"
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
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.handleSubmit}
                    underlayColor="#99d9f4">
                    <Text style={styles.buttonText}>Get Routes</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.8,
        flexDirection: "column",
        padding: 10,
        backgroundColor: '#ffffff',
        marginBottom: 7,
        justifyContent: 'center',
    },
    normal: {
        color: 'black',
        fontSize: 18,
        marginBottom: 7,
        fontWeight: '600',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
    },
    button: {
        marginTop: -20,
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
    }
});
