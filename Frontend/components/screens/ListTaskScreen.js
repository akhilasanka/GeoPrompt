import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  View,
  CheckBox,
} from 'react-native';
import axios from 'axios';
import {backendBaseURL} from '../constants/Constants';
import {Icon} from 'react-native-elements';
import BackgroundGeolocationWrapper from './BackgroundGeolocationWrapper';

export default class ListTaskScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colors: ['aliceblue', 'azure', 'beige'],
      tasks: [],
    };
  }
  static navigationOptions = ({navigation}) => ({
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
    var email = 'a';
    axios
      .get(backendBaseURL + '/geoprompt/tasks?email=' + email)
      .then((res) => {
        const tasks = res.data.results;
        this.setState({tasks: tasks});
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onPressEditButton = (item) => {
    //alert('U can edit task ' + item.title);
    this.props.navigation.navigate('EditReminderScreen', {taskid: item._id});
  };
  setTaskComplete = (item) => {
    axios
      .post(backendBaseURL + '/geoprompt/taskComplete', {itemid: item._id})
      .then(() => {
        alert('Congratulations on Completing the Task!');
        axios
          .get(backendBaseURL + '/geoprompt/tasks?email=a')
          .then((res) => {
            const tasks = res.data.results;
            this.setState({tasks: tasks});
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        alert(err);
      });
  };
  render() {
    if (this.state.tasks && this.state.tasks.length != 0) {
      return (
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            {this.state.tasks.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flex: 2,
                  backgroundColor: this.state.colors[index % 3],
                }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.text}>Status: {item.status}</Text>
                <Text style={styles.text}>Category: {item.categoryName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CheckBox
                    value={false}
                    onValueChange={() => this.setTaskComplete(item)}
                    style={styles.text}
                  />
                  <Text>Mark as complete!</Text>
                </View>
                <Button
                  style={styles.editButton}
                  title="Edit Task"
                  color="lightslategrey"
                  onPress={() => this.onPressEditButton(item)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <BackgroundGeolocationWrapper navigation={this.props.navigation} />
        </View>
      );
    } else {
      return (
        <View style={styles.NoTasks}>
          <Text>No tasks Added!!!</Text>
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
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'lightslategrey',
    color: 'white',
  },
  icon: {
    padding: 10,
  },
  iconPlus: {
    padding: 15,
    alignItems: 'flex-end',
  },
});
