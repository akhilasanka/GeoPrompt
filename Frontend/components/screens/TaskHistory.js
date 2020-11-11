import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  View,
  CheckBox
} from 'react-native';
import axios from 'axios';
import { backendBaseURL } from '../constants/Constants';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';


export default class TaskHistory extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Task History',
    headerLeft: Platform.select({
      ios: (
        <Icon
          name="ios-log-out"
          type="ionicon"
          containerStyle={styles.icon}
          onPress={() => navigation.navigate('LoginScreen')}
        />
      ),
      android: (
        <Icon
          name="md-menu"
          type="ionicon"
          containerStyle={styles.icon}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  });
  constructor(props) {
    super(props);
    this.state = {
      colors: ['aliceblue', 'azure', 'beige'],
      tasks: []
    };
  }
  componentDidMount() {
    var email = null;
    AsyncStorage.getItem('user-email').then((token) => {
      if (token) {
        console.log('email', token);
        email = token;
    this.subs = this.props.navigation.addListener("didFocus", () =>
      axios
        .get(backendBaseURL + '/geoprompt/completedTasks?email=' + email)
        .then((res) => {
          const tasks = res.data.results;
          this.setState({ tasks: tasks });
        })
        .catch((err) => {
          console.log(err);
        })
    );
      }
    });
  }

  render() {
    if (this.state.tasks && this.state.tasks.length != 0) {
      return (
        <ScrollView style={{ flex: 1 }}>
          {this.state.tasks.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{ flex: 2, backgroundColor: this.state.colors[index % 3] }}>
              <Text style={styles.title}>{item.title}</Text>
              { item.description ?
                <Text style={styles.description}>{item.description}</Text> :
                null
              }
              <Text style={styles.text}>Category: {item.categoryName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.NoTasks}>
          <Text>No Completed Tasks!!!</Text>
        </View>
      );
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
    borderColor: '#20232a',
    alignItems: 'center',
  },
  text: {
    color: '#4f603c',
    marginTop: 2,
  },
  title: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
  },
  description: {
    marginVertical: 4,
    fontSize: 15,
  },
  NoTasks: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonSection: {
    width: '100%',
    height: '40%',
    flexDirection: 'row'
  },
  editButton: {
    backgroundColor: 'lightslategrey',
    color: 'white',
    alignItems: 'center',
  },
  icon: {
    padding: 10,
  },
  iconPlus: {
    padding: 15,
    alignItems: 'flex-end',
  },
});
