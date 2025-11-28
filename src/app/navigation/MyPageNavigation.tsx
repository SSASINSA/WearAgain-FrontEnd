import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyPageScreen from '../../screens/mypage/MyPageScreen';
import MyPostsScreen from '../../screens/mypage/MyPostsScreen';
import MyCommentsScreen from '../../screens/mypage/MyCommentsScreen';
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
      <Stack.Screen
        name="MyPosts"
        component={MyPostsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyComments"
        component={MyCommentsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
