import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CalendarStack from './CalendarNavigation';
import StoreStack from './StoreNavigation';
import TicketsStack from './TicketsNavigation';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function HomeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={PlaceholderScreen} />
      <Stack.Screen name="Calendar" component={CalendarStack} />
      <Stack.Screen name="Store" component={StoreStack} />
      <Stack.Screen name="Tickets" component={TicketsStack} />
    </Stack.Navigator>
  );
}
