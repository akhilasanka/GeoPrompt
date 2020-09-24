import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import t from 'tcomb-form-native';
import axios from 'axios';
import {backendBaseURL} from '../constants/Constants';

const Form = t.form.Form;

const Email = t.refinement(t.String, (str) => {
  const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return reg.test(str);
});
const Password = t.refinement(t.String, (str) => {
  return str.length >= 6; // minimum password length should be 6 symbols
});

const User = t.struct({
  email: Email,
  password: Password,
});

var options = {
  fields: {
    email: {
      error: 'Please enter a valid email id',
    },
    password: {
      error: 'Please enter a valid password',
      password: true,
      secureTextEntry: true,
    },
  },
  stylesheet: formStyles,
};

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      errorMessage: '',
      isLoading: true,
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('willFocus', () => {
      console.log('Getting token');
      AsyncStorage.getItem('jwt-token').then((token) => {
        console.log('got token');
        if (token) {
          console.log('token', token);
          navigation.navigate('ListTaskScreen');
        } else {
          console.log('no token');
        }
        this.setState({
          value: null,
          errorMessage: '',
          isLoading: token !== null,
        });
      });
    });
  }

  handleSubmit = async () => {
    console.log('Submit event for signin');
    var value = this._form.getValue();
    console.log(value);
    if (value) {
      console.log(value);
      axios({
        method: 'post',
        url: backendBaseURL + '/geoprompt/signin',
        data: {
          email: value.email,
          password: value.password,
        },
      })
        .then(async (res) => {
          console.log(res);
          if (res.status === 200) {
            //store in AsyncStorage
            await AsyncStorage.setItem('jwt-token', res.data.token);
            await AsyncStorage.setItem('user-name', res.data.firstname);
            await AsyncStorage.setItem('user-email', res.data.email);
            this.props.navigation.navigate('ListTaskScreen');
          } else {
            this.setState({
              errorMessage:
                'Oops!!!Something went wrong!Please try again after sometime.',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.message.includes('401')) {
            this.setState({
              errorMessage: 'Invalid Credentials!',
            });
          } else {
            this.setState({
              errorMessage:
                'Oops!!!Something went wrong!Please try again after sometime.',
            });
          }
        });
    }
  };

  errorText = () => {
    if (this.state.errorMessage === '') {
      return <Text></Text>;
    } else {
      return <Text style={styles.error}>{this.state.errorMessage}</Text>;
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Form ref={(c) => (this._form = c)} type={User} options={options} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor="#99d9f4">
          <Text style={styles.buttonText}>Signin</Text>
        </TouchableHighlight>
        {this.errorText()}
      </View>
    );
  }
}

const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10,
    },
  },
  controlLabel: {
    normal: {
      color: 'blue',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600',
    },
    error: {
      color: 'red',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600',
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    marginTop: 50,
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    fontSize: 18,
    marginBottom: 7,
    fontWeight: '600',
  },
});
