import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight, Button, Alert } from 'react-native';
import axios from 'axios';
var t = require('tcomb-form-native');
import { backendBaseURL } from '../constants/Constants';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';

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

export default class EditTaskScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            initialvalue: {
                category: 'GroceryStore',
            },
            taskid: null,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Edit Task',
        headerTintColor: 'black',
        headerStyle: {
            backgroundColor: '#44ABEB',
        },
    });

    componentDidMount() {

        console.log(this.props.navigation.getParam("taskid", null));
        var taskid = this.props.navigation.getParam("taskid", null);

        if (taskid != null) {
            axios({
                method: 'get',
                url: 'http://10.0.0.66:3001/geoprompt/task',
                params: { "taskid": taskid },
                config: { headers: { 'Content-Type': 'application/json' } }
            })
                .then(res => {
                    const task = res.data.results[0];
                    console.log(task);
                    var category = task.categoryName;
                    if (category == 'Arts & Crafts Store') {
                        category = 'ArtsNCrafts';
                    }
                    else if (category == 'Coffee Shop') {
                        category = 'CoffeeShop';
                    }
                    else if (category == 'Grocery Store') {
                        category = 'GroceryStore';
                    }
                    else if (category == 'Gas Station') {
                        category = 'GasStation';
                    }
                    else if (category == 'Hardware Store') {
                        category = 'HardwareStore';
                    }
                    else if (category == 'Post Office') {
                        category = 'PostOffice';
                    }
                    console.log(category);
                    this.setState({
                        taskid: taskid,
                        initialvalue: {
                            category: category,
                            title: task.title,
                            note: task.description,
                            remindBefore: new Date(task.remindbefore),
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }


    handleSubmit = async () => {
        console.log('Submit event for update task');
        var user_email = null;
        AsyncStorage.getItem('user-email').then((token) => {
            if (token) {
                console.log('email', token);
                user_email = token;
                var value = this._form.getValue();
                console.log(value.remindBefore);
                if (value) {
                    // if validation fails, value will be null
                    console.log(value); // value here is an instance of Person
                    var note = '';
                    if (value.note != null) {
                        note = value.note;
                    }
                    axios({
                        method: 'put',
                        url: backendBaseURL + '/geoprompt/task',
                        data: {
                            taskid: this.state.taskid,
                            title: value.title,
                            description: note,
                            email: user_email,
                            categoryName: value.category,
                            remindbefore: value.remindBefore,
                        },
                        config: { headers: { 'Content-Type': 'multipart/form-data' } },
                    })
                        .then((res) => {
                            console.log(res);
                            if (res.status == 200) {
                                Alert.alert('Success!!!', 'Updated Task Successfully', [
                                    {
                                        text: 'OK',
                                        onPress: () => this.props.navigation.push('ListTaskScreen'),
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

    handleDelete = async () => {
        console.log('Submit event for delete task');
        await axios({
            method: 'post',
            url: backendBaseURL + '/geoprompt/task/delete',
            data: {
                taskid: this.state.taskid
            },
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
        })
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    Alert.alert('Success!!!', 'Successfully deleted!', [
                        {
                            text: 'OK',
                            onPress: () => this.props.navigation.push('ListTaskScreen'),
                        },
                    ]);
                } else {
                    Alert.alert('Oops!!!', "Couldn't delete task. Please try again.", [
                        { text: 'OK', onPress: () => console.log(res.responseMessage) },
                    ]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {

        return (
            <View style={styles.container}>
                <Form
                    ref={c => this._form = c}
                    type={Reminder}
                    options={options}
                    value={this.state.initialvalue}
                />
                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                    <View style={{ flex: 0.9 }}>
                        <TouchableHighlight style={styles.button} onPress={this.handleSubmit} underlayColor='#99d9f4'>
                            <Text style={styles.buttonText}>Update Task</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flex: 0.1 }}>
                        <Icon name="delete" type="material-icons" style={styles.iconContainer} onPress={this.handleDelete} />
                    </View>
                </View>
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
        marginTop: 0,
        height: 30,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginRight: 10
    },
    iconContainer: {
        textAlign: "right",
        padding: 20
    }
});