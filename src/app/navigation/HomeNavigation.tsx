import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ApplicationsStack from './ApplicationsNavigation';
import HomeScreen from '../../screens/home/HomeScreen';
import CommonHeader from '../../components/common/CommonHeader';

const Stack = createNativeStackNavigator();

export default function HomeNavigation() {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => {
        const handlePressApplication = () => {
          const rootNavigation = navigation.getParent()?.getParent();
          if (rootNavigation) {
            rootNavigation.navigate('ApplicationsStack');
          } else {
            navigation.navigate('Applications');
          }
        };

        return {
          header: () => (
            <CommonHeader
              titleImage={require('../../assets/icons/logo.png')}
              onPressTicket={handlePressApplication}
              onPressStore={() => navigation.getParent()?.navigate('Store')}
            />
          ),
        };
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Applications" component={ApplicationsStack} />
    </Stack.Navigator>
  );
}
