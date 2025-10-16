import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function GrowingNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Growing" component={PlaceholderScreen} />
      <Stack.Screen name="Rank" component={PlaceholderScreen} />
      <Stack.Screen name="ClothBook" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
