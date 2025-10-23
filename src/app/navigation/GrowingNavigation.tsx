import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';
import CommonHeader from '../../components/common/CommonHeader';

const Stack = createNativeStackNavigator();

export default function GrowingNavigation() {
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
      <Stack.Screen name="Growing" component={PlaceholderScreen} />
      <Stack.Screen name="Rank" component={PlaceholderScreen} />
      <Stack.Screen name="ClothBook" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
