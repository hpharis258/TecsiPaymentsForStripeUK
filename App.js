// React Deps
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';
// Screens
import Home from './screens/home';
import Settings from './screens/settings';
// Navigation Dependancies
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

{/* <ImageBackground
source={require('./logoTest.jpg')}
>
</ImageBackground> */}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};
const dimensions = Dimensions.get("window");

export default function App() {

  return (
    <ImageBackground
    source={require('./testBackground.jpg')}
    style={{flex: 1, justifyContent: 'center', height: dimensions.height + 50, width: dimensions.width}}
    resizeMode='cover'
    >
    <NavigationContainer theme={navTheme}>
       
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen 
          name="Home"
          component={Home}
        />
        <Stack.Screen 
         name='Settings'
         component={Settings} 
        />
      </Stack.Navigator> 
    </NavigationContainer>
    </ImageBackground> 
    
    
   
  );
}

const textStyle = StyleSheet.create({
  container: {

  }
})