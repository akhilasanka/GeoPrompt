import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import t from 'tcomb-form-native';

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

var options = {
  fields: {
    remindBefore: {
      mode: 'date', // display the Date field as a DatePickerAndroid
    },
  },
};

export default class WelcomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialvalue: {
        category: 'Groceries',
      },
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Form
          type={Reminder}
          options={options}
          value={this.state.initialvalue}
        />
        {/* Notice the addition of the Form component */}
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
});
