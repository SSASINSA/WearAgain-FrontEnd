import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigation from './BottomTabNavigation';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

export default function RootNavigation() {
  const isLogin = true;
  return (
    <NavigationContainer>
      {isLogin ? <BottomTabNavigation /> : <PlaceholderScreen />}
    </NavigationContainer>
  );
}
