import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function CalendarNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={PlaceholderScreen} />
      <Stack.Screen name="PartyDetail" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
