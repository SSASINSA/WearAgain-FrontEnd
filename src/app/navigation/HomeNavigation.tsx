import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TicketsStack from './TicketsNavigation';
import HomeScreen from '../../screens/home/HomeScreen';
import CommonHeader from '../../components/common/CommonHeader';


const Stack = createNativeStackNavigator();

export default function HomeNavigation() {
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
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tickets" component={TicketsStack} />
    </Stack.Navigator>
  );
}
