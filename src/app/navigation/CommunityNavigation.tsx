import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';
import CommunityScreen from '../../screens/community/CommunityScreen';
import CommonHeader from '../../components/common/CommonHeader';

const Stack = createNativeStackNavigator();

export default function CommunityNavigation() {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => {
        const handlePressApplication = () => {
          const tabNavigation = navigation.getParent();
          const rootNavigation = tabNavigation?.getParent();

          if (rootNavigation) {
            rootNavigation.navigate('ApplicationsStack');
          } else if (tabNavigation) {
            tabNavigation.navigate('Home', {screen: 'Applications'});
          } else {
            navigation.navigate('Applications');
          }
        };

        return {
          header: () => (
            <CommonHeader
              onPressTicket={handlePressApplication}
              onPressStore={() => navigation.getParent()?.navigate('Store')}
            />
          ),
        };
      }}>
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="CommunityDetail" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
