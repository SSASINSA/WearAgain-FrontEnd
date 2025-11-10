import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoreScreen from '../../screens/store/StoreScreen';
import ProductDetailScreen from '../../screens/store/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function StoreNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
