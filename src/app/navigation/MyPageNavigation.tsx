import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function MyPageNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyPage" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
