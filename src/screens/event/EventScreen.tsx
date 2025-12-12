import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {EventCard} from './EventCard';
import {useEventsList, EventSummary} from '../../hooks/useEvents';
import {Text} from '../../components/common/Text';

type FilterType = 'all' | 'APPROVAL' | 'OPEN' | 'CLOSED';

const FILTER_OPTIONS: Array<{value: FilterType; label: string}> = [
  {value: 'all', label: '전체'},
  {value: 'APPROVAL', label: '예정'},
  {value: 'OPEN', label: '모집중'},
  {value: 'CLOSED', label: '마감'},
];

export default function EventScreen() {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const filterParams =
    selectedFilter === 'all'
      ? undefined
      : {status: selectedFilter};

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useEventsList(filterParams);

  const refetchRef = useRef(refetch);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // 화면이 포커스될 때 리프레시 (스크롤 모션 없이)
  useFocusEffect(
    React.useCallback(() => {
      refetchRef.current();
    }, []),
  );

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  // 상태별 정렬 우선순위: 모집중 > 예정 > 마감
  const getStatusPriority = (status: string): number => {
    switch (status) {
      case '모집중':
        return 1;
      case '예정':
        return 2;
      case '마감':
        return 3;
      default:
        return 4;
    }
  };

  const allEvents =
    data?.pages.flatMap((page: {events: EventSummary[]}) => page.events) ?? [];

  // '전체' 필터일 때만 정렬 적용
  const events =
    selectedFilter === 'all'
      ? [...allEvents].sort((a, b) => {
          const priorityA = getStatusPriority(a.status);
          const priorityB = getStatusPriority(b.status);
          return priorityA - priorityB;
        })
      : allEvents;

  const handleEventPress = (event: EventSummary) => {
    navigation.navigate('EventDetail', {
      eventId: event.id,
    });
  };

  const renderEventItem = ({
    item,
  }: ListRenderItemInfo<EventSummary>) => (
    <EventCard
      title={item.title}
      description={item.description}
      startDate={item.startDate}
      endDate={item.endDate}
      location={item.location}
      status={item.status}
      imageUrl={item.thumbnailUrl}
      onPress={() => handleEventPress(item)}
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

  const renderStateView = (message: string, showRetry?: boolean) => (
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

  const renderFilterButton = (option: {value: FilterType; label: string}) => {
    const isSelected = selectedFilter === option.value;
    return (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.filterButton,
          isSelected && styles.filterButtonSelected,
        ]}
        onPress={() => setSelectedFilter(option.value)}
        activeOpacity={0.7}>
        <Text
          variant="labelM"
          color={isSelected ? '#FFFFFF' : '#6B7280'}
          style={styles.filterButtonText}>
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filterContent}>
          {FILTER_OPTIONS.map(renderFilterButton)}
        </View>
      </View>
      {isLoading && events.length === 0 ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#6B7280" />
        </View>
      ) : isError && events.length === 0 ? (
        renderStateView('이벤트를 불러오지 못했습니다.', true)
      ) : events.length === 0 ? (
        renderStateView('등록된 이벤트가 없습니다.', false)
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isManualRefreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  filterContainer: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
  },
  filterContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#06B0B7',
  },
  filterButtonText: {
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
