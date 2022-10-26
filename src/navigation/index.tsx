import { DeviceScreen } from '../screens/Device';
import { HomeScreen } from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Device } from 'react-native-ble-plx';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

export type RootStackParamList = {
  Home: undefined;
  Device: { device: Device };
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator mode="card">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Device" component={DeviceScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
