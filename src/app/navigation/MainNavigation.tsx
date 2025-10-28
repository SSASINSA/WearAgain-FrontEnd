import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigation from './BottomTabNavigation';
import PostDetailScreen from '../../screens/community/PostDetailScreen';
import PostRegisterScreen from '../../screens/community/PostRegisterScreen';
import EventDetailScreen from '../../screens/event/EventDetailScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTabNavigation} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="PostRegister" component={PostRegisterScreen} />
    </Stack.Navigator>
  );
}
