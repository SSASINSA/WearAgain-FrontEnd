import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarStack from './CalendarNavigation';
import StoreStack from './StoreNavigation';
import TicketsStack from './TicketsNavigation';
import HomeScreen from '../../screens/home/HomeScreen';
import CommonHeader from '../../components/common/CommonHeader';


const Stack = createNativeStackNavigator();

export default function HomeNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => (
          <CommonHeader
            onPressTicket={() => console.log('티켓 아이콘 클릭')}
            onPressStore={() => console.log('스토어 아이콘 클릭')}
          />
        ),
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Stack.Screen name="Calendar" component={CalendarStack} options={{ title: '캘린더' }} />
      <Stack.Screen name="Store" component={StoreStack} options={{ title: '스토어' }} />
      <Stack.Screen name="Tickets" component={TicketsStack} options={{ title: '티켓' }} />
    </Stack.Navigator>
  );
}
