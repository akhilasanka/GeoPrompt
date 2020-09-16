import React, {Component} from 'react';
import {TouchableOpacity, Platform, StyleSheet, Text, ScrollView, Button, View} from 'react-native';
import t from 'tcomb-form-native';
import axios from 'axios';

const Form = t.form.Form;

export default class WelcomeView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colors : ['aliceblue','azure','beige'],
      tasks : []
   }
  }
    componentDidMount() {
        axios.get("http://localhost:3001/geoprompt/tasks?userid=1")
          .then(res => {
                const tasks = res.data.results;
                this.setState({ tasks:tasks });
              })
          .catch(err => {
                console.log(err);
          })
    }
   alertItemName = (item) => {
      alert(item.title)
   }
   onPressEditButton = (item) => {
         alert("U can edit task "+item.title)
   }
  render() {
    return (
    <ScrollView style={{flex: 1}}>
            {
               this.state.tasks.map((item, index) => (
                  <TouchableOpacity
                     key = {item.id}
                     style = {{flex: 2, backgroundColor: this.state.colors[index%3]}}
                     onPress = {() => this.alertItemName(item)}>
                     <Text style = {styles.title}>
                        {item.title}
                     </Text>
                      <Text style = {styles.description}>
                         {item.description}
                      </Text>
                       <Text style = {styles.text}>
                           Status: {item.status}
                       </Text>
                      <Text style = {styles.text}>
                          Category: {item.categoryName}
                      </Text>
                      <View style={styles.editButtonSection}>
                        <Button
                          style = {styles.editButton}
                          title="Edit Task"
                          color='lightslategrey'
                          onPress={() => this.onPressEditButton(item)}
                        />
                      </View>
                  </TouchableOpacity>
               ))
            }
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create ({
   container: {
      padding: 10,
      marginTop: 3,
      backgroundColor: '#f8f8ff',
   },
   eachItem:{
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
        fontSize:15
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
   }
})
