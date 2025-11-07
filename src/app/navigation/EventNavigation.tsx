import React from 'react';
import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import CommonHeader from '../../components/common/CommonHeader';
import EventScreen from '../../screens/event/EventScreen';
import PlaceholderScreen from '../../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function EventNavigation() {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        header: () => (
          <CommonHeader
            onPressTicket={() => console.log('티켓 아이콘 클릭')}
            onPressStore={() => navigation.getParent()?.navigate('Store')}
          />
        ),
      })}
    >
      <Stack.Screen name="EventList" component={EventScreen} />
      <Stack.Screen name="CommunityDetail" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
