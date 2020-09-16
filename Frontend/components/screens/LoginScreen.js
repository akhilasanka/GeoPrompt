import React, {Component} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const User = t.struct({
  username: t.String,
  password: t.String,
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
  },
  stylesheet: formStyles,
};

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  handleSubmit = () => {
    const value = this._form.getValue();
    console.log('value: ', value);
    if (value) {
      this.props.navigation.navigate('ListTaskScreen');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Form ref={(c) => (this._form = c)} type={User} options={options} />
        <Button title="Login" onPress={this.handleSubmit} />
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
