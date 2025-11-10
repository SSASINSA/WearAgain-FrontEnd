import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {EventCard} from './EventCard';
import {useEventsList, EventSummary} from '../../hooks/useEvents';
import {Text} from '../../components/common/Text';

const eventImages = [
  require('../../assets/images/events/event1.jpg'),
  require('../../assets/images/events/event2.jpg'),
  require('../../assets/images/events/event3.jpg'),
  require('../../assets/images/events/event4.jpeg'),
];

export default function EventScreen() {
  const navigation = useNavigation<any>();
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useEventsList();

  const events =
    data?.pages.flatMap((page: {events: EventSummary[]}) => page.events) ?? [];

  const eventsWithImages = events.map((event, index) => ({
    ...event,
    imageSource: eventImages[index % eventImages.length],
  }));

  const handleEventPress = (event: EventSummary) => {
    navigation.navigate('EventDetail', {
      eventId: event.id,
    });
  };

  const renderEventItem = ({
    item,
    index,
  }: ListRenderItemInfo<EventSummary & {imageSource: any}>) => (
    <EventCard
      title={item.title}
      description={item.description}
      startDate={item.startDate}
      endDate={item.endDate}
      location={item.location}
      status={item.status}
      imageUrl={item.thumbnailUrl}
      imageSource={item.imageSource}
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

  return (
    <View style={styles.container}>
      {isLoading && events.length === 0 ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#6B7280" />
        </View>
      ) : isError && events.length === 0 ? (
        renderStateView('이벤트를 불러오지 못했습니다.', true)
      ) : events.length === 0 ? (
        renderStateView('등록된 이벤트가 없습니다.')
      ) : (
        <FlatList
          data={eventsWithImages}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
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
