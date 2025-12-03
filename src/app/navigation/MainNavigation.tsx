import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigation from './BottomTabNavigation';
import PostDetailScreen from '../../screens/community/PostDetailScreen';
import PostRegisterScreen from '../../screens/community/PostRegisterScreen';
import PostEditScreen from '../../screens/community/PostEditScreen';
import EventDetailScreen from '../../screens/event/EventDetailScreen';
import GrowingScreen from '../../screens/growing/GrowingScreen';
import RankingScreen from '../../screens/ranking/RankingScreen';
import StoreStack from './StoreNavigation';
import ApplicationsNavigation from './ApplicationsNavigation';
import ProfileSettingsScreen from '../../screens/mypage/ProfileSettingsScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTabNavigation} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="PostRegister" component={PostRegisterScreen} />
      <Stack.Screen name="PostEdit" component={PostEditScreen} />
      <Stack.Screen name="Growing" component={GrowingScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen
        name="ApplicationsStack"
        component={ApplicationsNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Store" component={StoreStack} />
    </Stack.Navigator>
  );
}
