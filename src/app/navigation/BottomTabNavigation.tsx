import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import HomeStack from './HomeNavigation';
import EventStack from './EventNavigation';
import CommunityStack from './CommunityNavigation';
import MyPageStack from './MyPageNavigation';
import {Text as CustomText} from '../../components/common/Text';
import HomeIcon from '../../assets/icons/home.svg';
import CommunityIcon from '../../assets/icons/community.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import QrCodeIcon from '../../assets/icons/qrcode.svg';
import ClothIcon from '../../assets/icons/cloth.svg';
import QRCodeModalScreen from '../../screens/qr/QRCodeModalScreen';



const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  return (
    <>
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
          <SafeAreaView style={styles.bottomNav} edges={['bottom']}>
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
                onPress={() => props.navigation.navigate('Event')}
              >
                <ClothIcon 
                  width={21} 
                  height={21} 
                  color={activeTabIndex === 1 ? '#06B0B7' : '#9CA3AF'}
                  style={styles.navIcon} 
                />
                <CustomText variant="bodyS" color={activeTabIndex === 1 ? '#06B0B7' : '#9CA3AF'} align="center">
                  행사
                </CustomText>
              </TouchableOpacity>

              {/* QR 코드 (중앙) */}
              <View style={styles.qrContainer}>
                <TouchableOpacity
                  onPress={() => setIsQRModalVisible(true)}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#06B0B7', '#642C8D']}
                    style={styles.qrButton}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    <QrCodeIcon width={30} height={30} style={styles.qrIcon} />
                  </LinearGradient>
                </TouchableOpacity>
                <CustomText variant="bodyS" color="#6B7280" align="center">
                  QR 코드
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
          </SafeAreaView>
        );
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Event" component={EventStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="MyPage" component={MyPageStack} />
    </Tab.Navigator>
    <QRCodeModalScreen
      isVisible={isQRModalVisible}
      onClose={() => setIsQRModalVisible(false)}
    />
    </>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    width: '100%',
    paddingTop: 9,
    paddingHorizontal: 10,
  },
  navContainer: {
    justifyContent: 'space-evenly',
      flexDirection: 'row',
      alignItems: 'center',
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
    marginHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    marginTop: -23,
    justifyContent: 'center',
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
