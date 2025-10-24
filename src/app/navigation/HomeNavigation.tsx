import React from 'react';
import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import CalendarStack from './CalendarNavigation';
import StoreStack from './StoreNavigation';
import TicketsStack from './TicketsNavigation';
import HomeScreen from '../../screens/home/HomeScreen';
import CommonHeader from '../../components/common/CommonHeader';


const Stack = createNativeStackNavigator();

function AppHeader(props: NativeStackHeaderProps) {
  const { navigation, route, options, back } = props;
  const title = options.title ?? route.name;

  return (
    <CommonHeader
      onPressTicket={() => console.log('티켓 아이콘 클릭')}
      onPressStore={() => console.log('스토어 아이콘 클릭')}
    />
  );
}

export default function HomeNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        // 기본 헤더를 가리고, 우리 헤더로 교체
        header: (props) => <AppHeader {...props} />,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Stack.Screen name="Calendar" component={CalendarStack} options={{ title: '캘린더' }} />
      <Stack.Screen name="Store" component={StoreStack} options={{ title: '스토어' }} />
      <Stack.Screen name="Tickets" component={TicketsStack} options={{ title: '티켓' }} />
    </Stack.Navigator>
  );
}
