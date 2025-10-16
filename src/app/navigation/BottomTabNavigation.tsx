import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from './HomeNavigation';
import GrowingStack from './GrowingNavigation';
import CommunityStack from './CommunityNavigation';
import MyPageStack from './MyPageNavigation';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Growing" component={GrowingStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="MyPage" component={MyPageStack} />
    </Tab.Navigator>
  );
}
