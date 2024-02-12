import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import ToDoScreen from '../screens/ToDoScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {Platform} from 'react-native';
import CustomDrawerContent from '../components/Drawer/CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerHome = () => (
  <Drawer.Navigator
    screenOptions={{headerShown: false}}
    drawerContent={props => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="ToDoScreen" component={ToDoScreen} />
  </Drawer.Navigator>
);

const Routes = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ToDo"
          component={DrawerHome}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default Routes;
