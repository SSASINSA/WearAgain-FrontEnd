import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text as CustomText} from '../../../components/common/Text';
import {useEventsList, EventSummary} from '../../../hooks/useEvents';

const eventImages = [
  require('../../../assets/images/events/event1.jpg'),
  require('../../../assets/images/events/event2.jpg'),
  require('../../../assets/images/events/event3.jpg'),
  require('../../../assets/images/events/event4.jpeg'),
];

export const EventsSection: React.FC = () => {
  const navigation = useNavigation<any>();
  const {data, isLoading} = useEventsList();

  const events =
    data?.pages.flatMap((page: {events: EventSummary[]}) => page.events) ?? [];

  const eventsWithImages = events.slice(0, 4).map((event, index) => ({
    ...event,
    imageSource: eventImages[index % eventImages.length],
  }));

  const handleEventPress = (event: EventSummary) => {
    navigation.navigate('EventDetail', {
      eventId: event.id,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.eventsSection}>
        <View style={styles.eventsHeader}>
          <CustomText variant="headlineM" color="#1F2937">
            진행 중인 이벤트
          </CustomText>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6B7280" />
        </View>
      </View>
    );
  }

  if (eventsWithImages.length === 0) {
    return null;
  }

  return (
    <View style={styles.eventsSection}>
      <View style={styles.eventsHeader}>
        <CustomText variant="headlineM" color="#1F2937">
          진행 중인 이벤트
        </CustomText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.eventsScrollView}
        contentContainerStyle={styles.eventsContainer}>
        {eventsWithImages.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => handleEventPress(event)}>
            <View style={styles.eventImage}>
              {event.imageSource && (
                <Image source={event.imageSource} style={styles.image} />
              )}
            </View>
            <View style={styles.eventContent}>
              <CustomText variant="headlineS" color="#1F2937" numberOfLines={1}>
                {event.title}
              </CustomText>
              <CustomText variant="bodyM" color="#4B5563" numberOfLines={2}>
                {event.description}
              </CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  eventsSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsScrollView: {
    marginBottom: 16,
  },
  eventsContainer: {
    paddingRight: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    width: 288,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    height: 128,
    backgroundColor: '#E5E7EB',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventContent: {
    padding: 16,
  },
  challengeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeButton: {
    paddingHorizontal: 8,
  },
});
