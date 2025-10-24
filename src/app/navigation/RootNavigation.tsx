import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigation from './BottomTabNavigation';
import {LoginScreen} from '../../screens/login';

export default function RootNavigation() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <BottomTabNavigation />
      ) : (
        <LoginScreen onTemporaryContinue={() => setIsLoggedIn(true)} />
      )}
    </NavigationContainer>
  );
}
