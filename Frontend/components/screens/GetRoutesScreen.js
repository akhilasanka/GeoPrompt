import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Alert,Linking } from 'react-native';
import axios from 'axios';
import {backendBaseURL} from '../constants/Constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import OriginComponent from './OriginComponent';
import DestinationComponent from './DestinationComponent';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDoCZjlJjKSxIbwuMLUv4Xg_dySO3Rfynw';

export default class GetRouteScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      origin:"",
      destination:""
    };
    this.getOriginData = this.getOriginData.bind(this);
    this.getDestinationData = this.getDestinationData.bind(this);
    }
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
        if(!this.state.origin || !this.state.destination){
                 Alert.alert("Enter both Origin & Destination");
        }
        var email = null;
        AsyncStorage.getItem('user-email').then((token) => {
            if (token) {
                console.log('email', token);
                email = token;
                axios
                    .get(backendBaseURL + '/geoprompt/recommendation?origin=' + this.state.origin + '&destination=' + this.state.destination + '&email=' + email)
                    .then((res) => {
                        if(res.status == 200)
                        {
                          this.setState({ url: res.data.results });
                          console.log(res.data.results)
                        }
                        else if(res.status== 201){
                              Alert.alert("OOPS!","Error Getting route with way points", [
                                  {
                                      text: 'OK',
                                      onPress: () => this.props.navigation.push('GetRoutesScreen'),
                                  },
                              ]);
                        }
                        else if(res.status== 202){
                               Alert.alert("OOPS!","Error Getting PlacesNearby", [
                                   {
                                       text: 'OK',
                                       onPress: () => this.props.navigation.push('GetRoutesScreen'),
                                   },
                               ]);
                        }
                        else if(res.status== 203){
                               Alert.alert("OOPS!","No Pending Tasks.", [
                                   {
                                       text: 'OK',
                                       onPress: () => this.props.navigation.push('GetRoutesScreen'),
                                   },
                               ]);
                        }
                        else if(res.status== 204){
                               Alert.alert("OOPS!","Destination cannot be geocoded", [
                                   {
                                       text: 'OK',
                                       onPress: () => this.props.navigation.push('GetRoutesScreen'),
                                   },
                               ]);
                        }
                        else if(res.status== 205){
                               Alert.alert("OOPS!","Origin cannot be geocoded", [
                                   {
                                       text: 'OK',
                                       onPress: () => this.props.navigation.push('GetRoutesScreen'),
                                   },
                               ]);
                        }
                        else if(res.status== 206){
                               Alert.alert("OOPS!",'Destination Cannot be reached from origin', [
                                   {
                                       text: 'OK',
                                       onPress: () => this.props.navigation.push('GetRoutesScreen'),
                                   },
                               ]);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    }
    getOriginData(val){
        this.setState({origin:val})
    }
    getDestinationData(val){
        this.setState({destination:val})
    }
    render() {
    var optimized = null;
    if(this.state.url){
      optimized = <Text style={{textAlign: 'center', // <-- the magic
                                    fontWeight: 'bold',
                                    color: 'blue',
                                    fontSize: 18,
                                    marginTop: 8,}} onPress={() => Linking.openURL(this.state.url)}>Generated Optimized Route</Text>;
    }
        return (
            <View style={styles.container} keyboardShouldPersistTaps="handled">
            <OriginComponent sendOriginData={this.getOriginData}/>
            <DestinationComponent sendDestinationData={this.getDestinationData}/>
                <TouchableHighlight
                    style={styles.button}
                    onPress={()=>this.handleSubmit()}
                    underlayColor="#99d9f4">
                    <Text style={styles.buttonText}>Get Routes</Text>
                </TouchableHighlight>
                {optimized}
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
