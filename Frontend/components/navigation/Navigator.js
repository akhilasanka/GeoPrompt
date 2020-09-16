import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import SampleScreen from '../screens/SampleScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AddReminderScreen from '../screens/AddReminderScreen';
import ListTaskScreen from '../screens/ListTaskScreen';
import NotificationLandingMapScreen from '../screens/NotificationLandingMapScreen';
import {Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';
import BurgerMenu from '../menu/BurgerMenu';

const HomeStack = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
    },
    AddReminderScreen: {
      screen: AddReminderScreen,
    },
    ListTaskScreen: {
      screen: ListTaskScreen,
    },
  },
  {
    initialRouteName: 'HomeScreen',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

HomeStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    tabBarLabel: 'Home',
    tabBarIcon: ({tintColor}) => (
      <Icon name="ios-home" type="ionicon" color={tintColor} />
    ),
    tabBarVisible,
    drawerLockMode,
    drawerLabel: 'Home',
    drawerIcon: ({tintColor}) => (
      <Icon name="md-home" type="ionicon" color={tintColor} />
    ),
  };
};

const NotificationStack = createStackNavigator({
  NotificationLandingMapScreen: {
    screen: NotificationLandingMapScreen,
  },
});

NotificationStack.navigationOptions = {
  drawerLabel: 'Notification Map',
  drawerIcon: ({tintColor}) => (
    <Icon name="md-map" type="ionicon" color={tintColor} />
  ),
};

const MainNavigator = Platform.select({
  android: createDrawerNavigator(
    {HomeStack, NotificationStack},
    {contentComponent: BurgerMenu},
  ),
});

const LoginStack = createStackNavigator({LoginScreen});

LoginStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: 'Login',
    tabBarIcon: ({tintColor}) => {
      let iconName = Platform.select({android: 'md-log-in'});
      return <Icon name={iconName} type="ionicon" color={tintColor} />;
    },
    tabBarVisible,
  };
};

const AuthTabs = createBottomTabNavigator({LoginStack, RegisterScreen});

const RootSwitch = createSwitchNavigator({
  AuthTabs: {
    screen: AuthTabs,
  },
  MainNavigator: {
    screen: MainNavigator,
  },
});

const RootContainer = createAppContainer(RootSwitch);

export default RootContainer;
