import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ApplicationListScreen from '../../screens/applications/ApplicationListScreen';
import ApplicationDetailScreen from '../../screens/applications/ApplicationDetailScreen';
import {ApplicationsStackParamList} from './types';

const Stack = createNativeStackNavigator<ApplicationsStackParamList>();

export default function ApplicationsNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ApplicationList" component={ApplicationListScreen} />
      <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} />
    </Stack.Navigator>
  );
}
