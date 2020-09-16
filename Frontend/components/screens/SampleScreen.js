import React, {Component} from 'react';
import {Text, View, Platform, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

export default class SampleScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Sample Screen',
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
  render() {
    return (
      <View style={styles.container}>
        <Text>This is the Settings Screen.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
