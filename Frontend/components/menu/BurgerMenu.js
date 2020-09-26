import AsyncStorage from '@react-native-community/async-storage';
import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaView, withNavigation} from 'react-navigation';
import {DrawerItems} from 'react-navigation-drawer';

class BurgerMenu extends PureComponent {
  clearToken = async () => {
    try {
      await AsyncStorage.removeItem('jwt-token');
      return true;
    } catch (error) {
      return false;
    }
  };

  clearName = async () => {
    try {
      await AsyncStorage.removeItem('user-name');
      return true;
    } catch (error) {
      return false;
    }
  };

  clearEmail = async () => {
    try {
      await AsyncStorage.removeItem('user-email');
      return true;
    } catch (error) {
      return false;
    }
  };

  onLogout = async () => {
    console.log(await this.clearToken());
    console.log(await this.clearName());
    console.log(await this.clearEmail());
    console.log(await AsyncStorage.getItem('jwt-token'));
    this.props.navigation.navigate('LoginScreen');
  };

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <ScrollView style={styles.container}>
          <DrawerItems {...this.props} />
        </ScrollView>
        <Button
          icon={{name: 'md-log-out', type: 'ionicon'}}
          title="Log Out"
          iconContainerStyle={styles.icon}
          buttonStyle={styles.button}
          titleStyle={styles.title}
          onPress={this.onLogout}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    marginHorizontal: 26,
    width: 24,
  },
  button: {
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
    margin: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default withNavigation(BurgerMenu);
