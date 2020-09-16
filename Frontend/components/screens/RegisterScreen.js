import React, {Component} from 'react';
import {Platform, View, StyleSheet, Button, LogBox} from 'react-native';
import {Icon} from 'react-native-elements';
import t from 'tcomb-form-native';

const Form = t.form.Form;
LogBox.ignoreAllLogs = true;
const User = t.struct({
  username: t.String,
  password: t.String,
  confirmPassword: t.String,
});

const options = {
  fields: {
    username: {
      error: 'Please enter a valid username',
    },
    password: {
      error: 'Please enter a valid password',
      password: true,
      secureTextEntry: true,
    },
    confirmPassword: {
      error: 'Please confirm the entered password',
      password: true,
      secureTextEntry: true,
    },
  },
  stylesheet: formStyles,
};

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.formRef = React.createRef();
    this.viewRef = React.createRef();
  }
  static navigationOptions = {
    tabBarLabel: 'Register',
    tabBarIcon: ({tintColor}) => {
      let iconName = Platform.select({android: 'md-person-add'});
      return <Icon name={iconName} type="ionicon" color={tintColor} />;
    },
  };

  handleSubmit = () => {
    const value = this.formRef.getValue();
    console.log('value: ', value);
    if (value) {
      this.props.navigation.navigate('LoginScreen');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Form
          type={User}
          ref={(ref) => (this.formRef = ref)}
          options={options}
        />
        <Button title="Register!" onPress={this.handleSubmit} />
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
});
