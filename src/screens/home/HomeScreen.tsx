import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileCard } from './components/ProfileCard';
import { BannerCarousel } from './components/BannerCarousel';
import { EventsSection } from './components/EventsSection';

export default function HomeScreen() {
  // 사용자 통계 데이터
  const userStats = {
    level: 5,
    name: '김해린',
    stats: [
      {
        id: 'clothes',
        label: '교환한 옷',
        value: 23,
      },
      {
        id: 'credit',
        label: '크레딧',
        value: 1250,
      },
      {
        id: 'ticket',
        label: '교환 티켓',
        value: 5,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.view}>
        {/* 사용자 프로필 카드 */}
        <ProfileCard userStats={userStats} />

        {/* 자동 스와이프 배너 */}
        <BannerCarousel />

        {/* 진행 중인 이벤트 */}
        <EventsSection />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  view: {
    flex: 1,
  },
});
