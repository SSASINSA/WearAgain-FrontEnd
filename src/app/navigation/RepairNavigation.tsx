import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function RepairNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Repair" component={PlaceholderScreen} />
      <Stack.Screen name="RepairDetail" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
