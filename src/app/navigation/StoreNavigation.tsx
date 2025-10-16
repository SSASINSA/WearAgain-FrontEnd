import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function StoreNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Store" component={PlaceholderScreen} />
      <Stack.Screen name="ProductDetail" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
