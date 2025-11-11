import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CommonHeader from '../../components/common/CommonHeader';
import EventScreen from '../../screens/event/EventScreen';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function EventNavigation() {
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
              title="행사"
              onPressTicket={handlePressApplication}
              onPressStore={() => navigation.getParent()?.navigate('Store')}
            />
          ),
        };
      }}
    >
      <Stack.Screen name="EventList" component={EventScreen} />
      <Stack.Screen name="CommunityDetail" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
