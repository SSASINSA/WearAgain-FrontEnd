import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';
import CommonHeader from '../../components/common/CommonHeader';

const Stack = createNativeStackNavigator();

export default function MyPageNavigation() {
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
      <Stack.Screen name="MyPage" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}
