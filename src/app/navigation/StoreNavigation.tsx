import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoreScreen from '../../screens/store/StoreScreen';
import ProductDetailScreen from '../../screens/store/product/ProductDetailScreen';
import OrderScreen from '../../screens/store/order/OrderScreen';

const Stack = createNativeStackNavigator();

export default function StoreNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
    </Stack.Navigator>
  );
}
