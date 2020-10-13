import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AddReminderScreen from '../screens/AddReminderScreen';
import ListTaskScreen from '../screens/ListTaskScreen';
import TaskHistory from '../screens/TaskHistory';
import NotificationLandingMapScreen from '../screens/NotificationLandingMapScreen';
import EditReminderScreen from '../screens/EditReminderScreen';
import GetRoutesScreen from '../screens/GetRoutesScreen';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import BurgerMenu from '../menu/BurgerMenu';

const HomeStack = createStackNavigator(
  {
    AddReminderScreen: {
      screen: AddReminderScreen,
    },
    ListTaskScreen: {
      screen: ListTaskScreen,
    },
    EditReminderScreen: {
      screen: EditReminderScreen,
    },
  },
  {
    initialRouteName: 'ListTaskScreen',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    tabBarLabel: 'Tasks',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="ios-home" type="ionicon" color={tintColor} />
    ),
    tabBarVisible,
    drawerLockMode,
    drawerLabel: 'Tasks',
    drawerIcon: ({ tintColor }) => (
      <Icon name="md-home" type="ionicon" color={tintColor} />
    ),
  };
};

const TaskHistoryStack = createStackNavigator({
  TaskHistory: {
    screen: TaskHistory,
  },
});

TaskHistoryStack.navigationOptions = {
  drawerLabel: 'Task History',
  drawerIcon: ({ tintColor }) => (
    <Icon name="history" />
  ),
};

const NotificationStack = createStackNavigator({
  NotificationLandingMapScreen: {
    screen: NotificationLandingMapScreen,
  },
});

NotificationStack.navigationOptions = {
  drawerLabel: 'Notification Map',
  drawerIcon: ({ tintColor }) => (
    <Icon name="md-map" type="ionicon" color={tintColor} />
  ),
};

const RouteOptimizatorStack = createStackNavigator({
  GetRoutesScreen: {
    screen: GetRoutesScreen,
  },
});

RouteOptimizatorStack.navigationOptions = {
  drawerLabel: 'Complete tasks on your way',
  drawerIcon: ({ tintColor }) => (
    <Icon name="md-paper-plane" type="ionicon" color={tintColor} />
  ),
};



const MainNavigator = Platform.select({
  android: createDrawerNavigator(
    { HomeStack, TaskHistoryStack, NotificationStack, RouteOptimizatorStack },
    { contentComponent: BurgerMenu }
  ),
});

const LoginStack = createStackNavigator({ LoginScreen });

LoginStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: 'Login',
    tabBarIcon: ({ tintColor }) => {
      let iconName = Platform.select({ android: 'md-log-in' });
      return <Icon name={iconName} type="ionicon" color={tintColor} />;
    },
    tabBarVisible,
  };
};

const AuthTabs = createBottomTabNavigator({ LoginStack, RegisterScreen });

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
