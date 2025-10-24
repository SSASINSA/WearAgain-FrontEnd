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

  // 배너 데이터
  const banners = [
    {
      id: 1,
      title: '환경 뉴스레터',
      buttonText: '보러가기',
      backgroundColor: '#642C8D',
      icon: 'sms' as const,
    },
    {
      id: 2,
      title: '당신의 마음을 입히세요',
      buttonText: '응원하기',
      backgroundColor: '#E27931',
      icon: 'volunteer' as const,
    },
  ];

  // 이벤트 데이터
  const events = [
    {
      id: 1,
      title: '👕아름다운X수선혁명랩(Lab)',
      description: "'교환'과 '수선'으로 끝까지 입는 경험과 실천을 제공하는 지속 가능한 의생활 실험 공간",
      image: '이미지 1',
    },
    {
      id: 2,
      title: '업사이클링 워크샵',
      description: '헌 옷을 새롭게 변신시켜보세요',
      image: '이미지 2',
    },
    {
      id: 3,
      title: '에코 패션 챌린지',
      description: '30일간 지속가능한 패션 실천하기',
      image: '이미지 3',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.view}>
        {/* 사용자 프로필 카드 */}
        <ProfileCard userStats={userStats} />

        {/* 자동 스와이프 배너 */}
        <BannerCarousel banners={banners} />

        {/* 진행 중인 이벤트 */}
        <EventsSection events={events} />
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
