import AsyncStorage from '@react-native-community/async-storage';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('jwt-token');
    return true;
  } catch (error) {
    return false;
  }
};

const clearName = async () => {
  try {
    await AsyncStorage.removeItem('user-name');
    return true;
  } catch (error) {
    return false;
  }
};

const clearEmail = async () => {
  try {
    await AsyncStorage.removeItem('user-email');
    return true;
  } catch (error) {
    return false;
  }
};

const clearFireBaseToken = async () => {
  try {
    await AsyncStorage.removeItem('firebase-android-token');
    return true;
  } catch (error) {
    return false;
  }
}

export const onLogout = async () => {
  BackgroundGeolocation.stop();
  console.log(await clearToken());
  console.log(await clearName());
  console.log(await clearEmail());
  console.log(await clearFireBaseToken());
  console.log(await AsyncStorage.getItem('jwt-token'));
};
