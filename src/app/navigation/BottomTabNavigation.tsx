import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, View, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeStack from './HomeNavigation';
import GrowingStack from './GrowingNavigation';
import CommunityStack from './CommunityNavigation';
import MyPageStack from './MyPageNavigation';
import {Text as CustomText} from '../../components/common/Text';
import HomeIcon from '../../assets/icons/home.svg';
import CalendarIcon from '../../assets/icons/calendar.svg';
import CommunityIcon from '../../assets/icons/community.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import QrCodeIcon from '../../assets/icons/qrcode.svg';



const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none', // 기본 탭바 숨기기
        },
      }}
      tabBar={(props) => {
        const { state } = props;
        const activeTabIndex = state.index;
        
        return (
          <View style={styles.bottomNav}>
            <View style={styles.navContainer}>
              {/* 홈 */}
              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => props.navigation.navigate('Home')}
              >
                <HomeIcon 
                  width={20} 
                  height={20} 
                  color={activeTabIndex === 0 ? '#06B0B7' : '#9CA3AF'}
                  style={styles.navIcon} 
                />
                <CustomText variant="bodyS" color={activeTabIndex === 0 ? '#06B0B7' : '#9CA3AF'} align="center">
                  홈
                </CustomText>
              </TouchableOpacity>

              {/* 행사 */}
              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => props.navigation.navigate('Growing')}
              >
                <CalendarIcon 
                  width={20} 
                  height={20} 
                  color={activeTabIndex === 1 ? '#06B0B7' : '#9CA3AF'}
                  style={styles.navIcon} 
                />
                <CustomText variant="bodyS" color={activeTabIndex === 1 ? '#06B0B7' : '#9CA3AF'} align="center">
                  행사
                </CustomText>
              </TouchableOpacity>

              {/* QR 코드 (중앙) */}
              <View style={styles.qrContainer}>
                <LinearGradient
                  colors={['#06B0B7', '#642C8D']}
                  style={styles.qrButton}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <QrCodeIcon width={30} height={30} style={styles.qrIcon} />
                </LinearGradient>
                <CustomText variant="bodyS" color="#6B7280" align="center">
                  OR
                </CustomText>
              </View>

              {/* 커뮤니티 */}
              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => props.navigation.navigate('Community')}
              >
                <CommunityIcon 
                  width={20} 
                  height={20} 
                  color={activeTabIndex === 2 ? '#06B0B7' : '#9CA3AF'}
                  style={styles.navIcon} 
                />
                <CustomText variant="bodyS" color={activeTabIndex === 2 ? '#06B0B7' : '#9CA3AF'} align="center">
                  커뮤니티
                </CustomText>
              </TouchableOpacity>

              {/* 내정보 */}
              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => props.navigation.navigate('MyPage')}
              >
                <ProfileIcon 
                  width={20} 
                  height={20} 
                  color={activeTabIndex === 3 ? '#06B0B7' : '#9CA3AF'}
                  style={styles.navIcon} 
                />
                <CustomText variant="bodyS" color={activeTabIndex === 3 ? '#06B0B7' : '#9CA3AF'} align="center">
                  내정보
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Growing" component={GrowingStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="MyPage" component={MyPageStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 100,
    paddingTop: 9,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 64,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 20,
    height: 20,
    marginBottom: 4,
  },
  qrContainer: {
    alignItems: 'center',
    position: 'relative',
    marginTop: -23,
  },
  qrButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  qrIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
});
