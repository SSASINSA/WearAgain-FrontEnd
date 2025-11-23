import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyPageScreen from '../../screens/mypage/MyPageScreen';
import CommonHeader from '../../components/common/CommonHeader';

const Stack = createNativeStackNavigator();

export default function MyPageNavigation() {
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
              title="더보기"
              onPressTicket={handlePressApplication}
              onPressStore={() => navigation.getParent()?.navigate('Store')}
            />
          ),
        };
      }}
    >
      <Stack.Screen name="MyPage" component={MyPageScreen} />
    </Stack.Navigator>
  );
}
