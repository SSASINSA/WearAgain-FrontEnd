import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './MainNavigation';
import {LoginScreen} from '../../screens/login';

export default function RootNavigation() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainNavigation />
      ) : (
        <LoginScreen onTemporaryContinue={() => setIsLoggedIn(true)} />
      )}
    </NavigationContainer>
  );
}
