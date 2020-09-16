import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomePage from './components/WelcomePage';
import AddReminder from './components/AddReminder';
import NotificationLandingMap from './components/NotificationLandingMap';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="WelcomePage" component={WelcomePage} />
        <Stack.Screen name="AddReminder" component={AddReminder} />
        <Stack.Screen name="NotificationLandingMap" component={NotificationLandingMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
