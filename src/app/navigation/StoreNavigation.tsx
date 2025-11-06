import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoreScreen from '../../screens/store/StoreScreen';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function StoreNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="ProductDetail" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
