import React, { Component } from 'react';
import { TouchableOpacity, Platform, StyleSheet, Text, ScrollView, Button, View } from 'react-native';
import t from 'tcomb-form-native';
import axios from 'axios';
import { Icon } from 'react-native-elements';

export default class ListTaskScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            colors: ['aliceblue', 'azure', 'beige'],
            tasks: []
        }
    }
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Home',
        headerLeft: () => (
            <Icon
                name="md-menu"
                type="ionicon"
                containerStyle={styles.icon}
                onPress={() => navigation.toggleDrawer()}
            />
        ),
        headerRight: () => (
            <Icon
                name="add-task"
                type="material-icons"
                containerStyle={styles.iconPlus}
                onPress={() => navigation.navigate('AddReminderScreen')}
            />
        ),
    });
    componentDidMount() {
        axios.get("http://localhost:3001/geoprompt/tasks?userid=1")
            .then(res => {
                const tasks = res.data.results;
                this.setState({ tasks: tasks });
            })
            .catch(err => {
                console.log(err);
            })
    }
    onPressEditButton = (item) => {
        alert("U can edit task " + item.title)
    }
    render() {
        if (this.state.tasks && this.state.tasks.length != 0) {
            return (
                <ScrollView style={{ flex: 1 }}>
                    {this.state.tasks.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{ flex: 2, backgroundColor: this.state.colors[index % 3] }}>
                            <Text style={styles.title}>
                                {item.title}
                            </Text>
                            <Text style={styles.description}>
                                {item.description}
                            </Text>
                            <Text style={styles.text}>
                                Status: {item.status}
                            </Text>
                            <Text style={styles.text}>
                                Category: {item.categoryName}
                            </Text>
                            <View style={styles.editButtonSection}>
                                <Button
                                    style={styles.editButton}
                                    title="Edit Task"
                                    color='lightslategrey'
                                    onPress={() => this.onPressEditButton(item)}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )
        }
        else {
            return (
                <View style={styles.NoTasks}>
                    <Text>No tasks Added!!!</Text>
                </View>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 3,
        backgroundColor: '#f8f8ff',
    },
    eachItem: {
        borderWidth: 1,
        borderColor: "#20232a",
        alignItems: 'center',
    },
    text: {
        color: '#4f603c'
    },
    title: {
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 0,
    },
    description: {
        marginVertical: 4,
        fontSize: 15
    },
    NoTasks: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editButtonSection: {
        width: '100%',
        height: '30%',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    editButton: {
        backgroundColor: 'lightslategrey',
        color: 'white'
    },
    icon: {
        padding: 10,
    },
    iconPlus: {
        padding: 15,
        alignItems: 'flex-end'
    },
})