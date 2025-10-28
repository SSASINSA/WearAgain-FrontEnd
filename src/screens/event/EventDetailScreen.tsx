import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {Text} from '../../components/common/Text';
import EventDetailContent from './EventDetailContent';
import EventApplicationModal from './EventApplicationModal';
import DetailHeader from '../../components/common/DetailHeader';

export interface EventDetailProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  address?: string;
  time?: string;
  status: '예정' | '진행중' | '종료';
  imageUrl?: string;
  tags?: string[];
  category?: string;
}

export type EventStackParamList = {
  EventList: undefined;
  EventDetail: {
    event: EventDetailProps;
  };
};

export type EventDetailParamList = {
  EventDetail: {
    event: EventDetailProps;
  };
};

export interface EventApplicationOptions {
  participants?: string;
  time?: string;
}

type EventDetailRouteProp = RouteProp<
  EventDetailParamList,
  'EventDetail'
>;

export default function EventDetailScreen() {
  const route = useRoute<EventDetailRouteProp>();
  const {event} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleApplicationConfirm = (options: EventApplicationOptions) => {
    console.log('선택된 옵션:', options);
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DetailHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <EventDetailContent event={event} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => setIsModalVisible(true)}>
          <Text variant="headlineM" color="#FFFFFF" style={styles.applyButtonText}>
            신청하기
          </Text>
        </TouchableOpacity>
      </View>

      <EventApplicationModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleApplicationConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#8a3fb8',
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
