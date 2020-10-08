import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight, Button, Alert } from 'react-native';
import axios from 'axios';
var t = require('tcomb-form-native');
import { backendBaseURL } from '../constants/Constants';

const Form = t.form.Form;

var Category = t.enums(
    {
        Groceries: 'Grocery',
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
                category: 'Groceries',
            },
            taskid: null,
        }
    }

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
                    this.setState({
                        taskid: taskid,
                        initialvalue: {
                            category: task.categoryName,
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
        var value = this._form.getValue();
        console.log(value.remindBefore);
        if (value) {
            // if validation fails, value will be null
            console.log(value); // value here is an instance of Person
            var note = '';
            if (value.note != null) {
                note = value.note;
            }
            await axios({
                method: 'put',
                url: backendBaseURL + '/geoprompt/task',
                data: {
                    taskid: this.state.taskid,
                    title: value.title,
                    description: note,
                    email: 'a',
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
                <TouchableHighlight style={styles.button} onPress={this.handleSubmit} underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Update Task</Text>
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