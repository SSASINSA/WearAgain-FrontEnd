import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text as CustomText } from '../../../components/common/Text';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface EventsSectionProps {
  events: Event[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
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
        contentContainerStyle={styles.eventsContainer}
      >
        {events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventImage}>
              <CustomText variant="bodyM" color="#FFFFFF" align="center">
                {event.image}
              </CustomText>
            </View>
            <View style={styles.eventContent}>
              <CustomText variant="headlineS" color="#1F2937">
                {event.title}
              </CustomText>
              <CustomText variant="bodyM" color="#4B5563">
                {event.description}
              </CustomText>
            </View>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
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
