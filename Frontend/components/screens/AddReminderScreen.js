import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Alert } from 'react-native';
var t = require('tcomb-form-native');
import axios from 'axios';
import { backendBaseURL } from '../constants/Constants';
import AsyncStorage from '@react-native-community/async-storage';

const Form = t.form.Form;

var Category = t.enums(
  {
    ArtsNCrafts: 'Arts & Crafts Store',
    ATM: 'ATM',
    Bookstore: 'Bookstore',
    CoffeeShop: 'Coffee Shop',
    Food: 'Food',
    GroceryStore: 'Grocery Store',
    GasStation: 'Gas Station',
    HardwareStore: 'Hardware Store',
    PostOffice: 'Post Office'
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
      marginBottom: 10,
    },
  },
  controlLabel: {
    normal: {
      color: 'black',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600',
    },
    // the style applied when a validation error occours
    error: {
      color: 'black',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600',
    },
  },
};

var options = {
  fields: {
    remindBefore: {
      mode: 'date', // display the Date field as a DatePickerAndroid
      error: 'Please provide a date',
    },
    title: {
      error: 'Please provide title',
    },
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

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Add Task',
    headerTintColor: 'black',
    headerStyle: {
      backgroundColor: '#44ABEB',
    },
  });

  handleSubmit = async () => {
    console.log('Submit event for add task');
    var user_email = null;
    AsyncStorage.getItem('user-email').then((token) => {
      if (token) {
        console.log('email', token);
        user_email = token;
        var value = this._form.getValue();
        if (value) {
          // if validation fails, value will be null
          console.log(value); // value here is an instance of Person
          console.log(user_email);
          var note = '';
          if (value.note != null) {
            note = value.note;
          }
          var category = value.category;
          if (value.category == 'ArtsNCrafts') {
            category = 'Arts & Crafts Store';
          }
          else if (value.category == 'CoffeeShop') {
            category = 'Coffee Shop';
          }
          else if (value.category == 'GroceryStore') {
            category = 'Grocery Store';
          }
          else if (value.category == 'GasStation') {
            category = 'Gas Station';
          }
          else if (value.category == 'HardwareStore') {
            category = 'Hardware Store';
          }
          else if (value.category == 'PostOffice') {
            category = 'Post Office';
          }
          console.log(category);
          axios({
            method: 'post',
            url: backendBaseURL + '/geoprompt/task',
            data: {
              title: value.title,
              description: note,
              email: user_email,
              categoryName: category,
              remindbefore: value.remindBefore,
            },
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
          })
            .then((res) => {
              console.log(res);
              if (res.status == 200) {
                Alert.alert('Success!!!', 'Added Task Successfully', [
                  {
                    text: 'OK',
                    onPress: () => {
                      this.props.navigation.push('ListTaskScreen');
                      this.setState({ initialvalue: null });
                    },
                  },
                ]);
              } else {
                Alert.alert('Oops!!!', "Couldn't add task. Please try again.", [
                  { text: 'OK', onPress: () => console.log(res.responseMessage) },
                ]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });

  };

  render() {
    return (
      <View style={styles.container}>
        <Form
          ref={(c) => (this._form = c)}
          type={Reminder}
          options={options}
          value={this.state.initialvalue}
        />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor="#99d9f4">
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
});
