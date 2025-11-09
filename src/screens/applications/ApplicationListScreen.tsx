import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DetailHeader from '../../components/common/DetailHeader';
import {ApplicationHistoryCard} from './ApplicationHistoryCard';
import {ApplicationSummary} from './types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ApplicationsStackParamList} from '../../app/navigation/types';
import {Text} from '../../components/common/Text';
import {useApplicationsList} from '../../hooks/useApplications';

type NavigationProp = NativeStackNavigationProp<
  ApplicationsStackParamList,
  'ApplicationList'
>;

export default function ApplicationListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useApplicationsList();

  const applications =
    data?.pages.flatMap(page => page.items as ApplicationSummary[]) ?? [];

  const handlePressItem = (item: ApplicationSummary) => {
    navigation.navigate('ApplicationDetail', {
      applicationId: item.id,
      initialData: item,
    });
  };

  const renderApplicationItem = ({
    item,
  }: ListRenderItemInfo<ApplicationSummary>) => (
    <ApplicationHistoryCard
      application={item}
      onPress={() => handlePressItem(item)}
    />
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#6B7280" />
      </View>
    );
  };

  const renderStateView = (
    message: string,
    showRetry?: boolean,
  ) => (
    <View style={styles.stateContainer}>
      <Text variant="bodyM" color="#6B7280" style={styles.stateText}>
        {message}
      </Text>
      {showRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text variant="labelM" color="#FFFFFF">
            다시 시도
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <DetailHeader title="신청 내역" useTopInset />
      <View style={styles.container}>
        {isLoading && applications.length === 0 ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color="#6B7280" />
          </View>
        ) : isError && applications.length === 0 ? (
          renderStateView('신청 내역을 불러오지 못했습니다.', true)
        ) : applications.length === 0 ? (
          renderStateView('아직 신청 내역이 없습니다.')
        ) : (
          <FlatList
            data={applications}
            renderItem={renderApplicationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.8}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  stateText: {
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#06B0B7',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
});
