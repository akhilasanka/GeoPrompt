import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight, Button } from 'react-native';
var t = require('tcomb-form-native');

const Form = t.form.Form;

var Category = t.enums(
  {
    Groceries: 'Groceries',
    GasStation: 'Gas Station',
  },
  'Category',
);

const Reminder = t.struct({
  title: t.String,
  note: t.maybe(t.String),
  category: Category,
  remindBefore: t.Date,
});

const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
    },
  },
  controlLabel: {
    normal: {
      color: 'black',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    },
    // the style applied when a validation error occours
    error: {
      color: 'black',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    }
  }
}

var options = {
  fields: {
    remindBefore: {
      mode: 'date', // display the Date field as a DatePickerAndroid
      error: 'Please provide a date'
    },
    title: {
      error: 'Please provide title'
    }
  },
  stylesheet: formStyles,
};

export default class AddReminderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialvalue: {
        category: 'Groceries',
      },
    };
  }

  handleSubmit = () => {
    console.log("Submit event");
    var value = this._form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Form
          ref={c => this._form = c}
          type={Reminder}
          options={options}
          value={this.state.initialvalue}
        />
        <TouchableHighlight style={styles.button} onPress={this.handleSubmit} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
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
    justifyContent: 'center'
  }
});

