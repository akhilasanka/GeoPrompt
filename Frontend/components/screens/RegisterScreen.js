import React, {Component} from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Alert,
  TouchableHighlight,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
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
  firstname: t.String,
  lastname: t.String,
  email: Email,
  password: Password,
});

var options = {
  fields: {
    firstname: {
      error: 'Please enter a valid name',
    },
    lastname: {
      error: 'Please enter a valid name',
    },
    email: {
      error: 'Please enter a valid email',
    },
    password: {
      error: 'Please enter a valid password',
      password: true,
      secureTextEntry: true,
    },
  },
  stylesheet: formStyles,
};

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      errorMessage: '',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('willFocus', () => {
      this.setState({
        value: null,
        errorMessage: '',
      });
    });
  }

  static navigationOptions = {
    tabBarLabel: 'Register',
    tabBarIcon: ({tintColor}) => {
      let iconName = Platform.select({android: 'md-person-add'});
      return <Icon name={iconName} type="ionicon" color={'#000000'} />;
    },
    tabBarOptions: {
      style: {
        backgroundColor: '#44ABEB',
      },
      activeTintColor: '#FFFFFF',
      labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
      },
    },
  };

  onChange(value) {
    this.setState({value, errorMessage: ''});
  }

  handleSubmit = async () => {
    console.log('Submit event for signup');
    var value = this._form.getValue();
    console.log(value);
    if (value) {
      console.log(value);
      axios({
        method: 'post',
        url: backendBaseURL + '/geoprompt/signup',
        data: {
          firstname: value.firstname,
          lastname: value.lastname,
          email: value.email,
          password: value.password,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            Alert.alert('Success!!!', 'Signup Successful', [
              {
                text: 'OK',
                onPress: () => this.props.navigation.navigate('LoginScreen'),
              },
            ]);
          } else {
            this.setState({
              errorMessage:
                'Oops!!!Something went wrong!Please try again after sometime.',
            });
          }
        })
        .catch((err) => {
          console.log('ERROR IN POST');
          console.log(err);
          if (err.message.includes('409')) {
            this.setState({
              errorMessage: 'Username Already Registered!',
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
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../images/geoprompt-logo.png')}
        />
        <Form
          type={User}
          options={options}
          ref={(c) => (this._form = c)}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
        />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor="#99d9f4">
          <Text style={styles.buttonText}>Signup</Text>
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
    backgroundColor: '#44ABEB',
    borderColor: '#44ABEB',
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
  logo: {
    height: Dimensions.get('window').width * 0.56,
    width: Dimensions.get('window').width * 0.9,
    resizeMode: 'contain',
  },
});
