import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function TicketsNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tickets" component={PlaceholderScreen} />
      <Stack.Screen name="TicketDetail" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
