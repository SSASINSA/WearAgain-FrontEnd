import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import MainNavigation from './MainNavigation';
import {LoginScreen} from '../../screens/login';
import {useAuthStore} from '../../store/auth.store';

export default function RootNavigation() {
  const status = useAuthStore(state => state.status);
  const isHydrated = useAuthStore(state => state.isHydrated);
  const lastError = useAuthStore(state => state.lastError);
  const hydrate = useAuthStore(state => state.hydrate);
  const loginSuccess = useAuthStore(state => state.loginSuccess);

  React.useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const handleLoginSuccess = React.useCallback(
    (payload: Parameters<typeof loginSuccess>[0]) => {
      void loginSuccess(payload);
    },
    [loginSuccess],
  );

  const showLoading =
    status === 'hydrating' || (!isHydrated && status === 'idle');

  return (
    <NavigationContainer>
      {showLoading ? (
        <SessionLoading />
      ) : status === 'authenticated' ? (
        <MainNavigation />
      ) : (
        <LoginScreen
          initialErrorMessage={lastError}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </NavigationContainer>
  );
}

function SessionLoading() {
  return (
    <View style={styles.sessionGate}>
      <ActivityIndicator size="large" color="#111111" />
    </View>
  );
}

const styles = StyleSheet.create({
  sessionGate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
