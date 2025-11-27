import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { ProfileCard } from './components/ProfileCard';
import { BannerCarousel } from './components/BannerCarousel';
import { EventsSection } from './components/EventsSection';
import { useBannerStore } from '../../store/banner.store';

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isUserInteracting } = useBannerStore();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // 관련 쿼리들을 모두 refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['user', 'summary'] }),
        queryClient.refetchQueries({ queryKey: ['events', 'list'] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isUserInteracting}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* 사용자 프로필 카드 */}
        <ProfileCard />

        {/* 자동 스와이프 배너 */}
        <BannerCarousel />

        {/* 진행 중인 이벤트 */}
        <EventsSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
