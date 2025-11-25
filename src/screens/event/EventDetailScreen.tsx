import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '../../components/common/Text';
import EventDetailContent from './EventDetailContent';
import EventApplicationModal from './EventApplicationModal';
import EventCancelModal from './EventCancelModal';
import DetailHeader from '../../components/common/DetailHeader';
import {
  useEventDetail,
  useApplyEvent,
  useCancelEventApplication,
} from '../../hooks/useEvents';

const eventImages = [
  require('../../assets/images/events/event1.jpg'),
  require('../../assets/images/events/event2.jpg'),
  require('../../assets/images/events/event3.jpg'),
  require('../../assets/images/events/event4.jpeg'),
];

export type EventDetailParamList = {
  EventDetail: {
    eventId: string;
  };
};

type EventDetailRouteProp = RouteProp<EventDetailParamList, 'EventDetail'>;

export default function EventDetailScreen() {
  const route = useRoute<EventDetailRouteProp>();
  const {eventId} = route.params;
  const {data: event, isLoading, isError} = useEventDetail(eventId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const applyEventMutation = useApplyEvent();
  const cancelEventMutation = useCancelEventApplication();

  const handleApplicationConfirm = (optionId: number, memo: string) => {
    if (!event) {
      Alert.alert('오류', '이벤트 정보를 불러올 수 없습니다.');
      return;
    }

    const eventIdNumber = parseInt(eventId, 10);
    if (isNaN(eventIdNumber)) {
      Alert.alert('오류', '잘못된 이벤트 ID입니다.');
      return;
    }

    applyEventMutation.mutate(
      {
        eventId: eventIdNumber,
        body: {
          optionId,
          memo: memo || undefined,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('신청 완료', '행사 신청이 완료되었습니다.');
          setIsModalVisible(false);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          Alert.alert('신청 실패', errorMessage);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <DetailHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B7280" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !event) {
    return (
      <SafeAreaView style={styles.container}>
        <DetailHeader />
        <View style={styles.errorContainer}>
          <Text variant="bodyM" color="#6B7280">
            이벤트 정보를 불러오지 못했습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const availableOptions = event.options.filter(
    option => (option.remainingCount ?? 0) > 0,
  );

  const eventIndex = parseInt(eventId) - 1;
  const eventImageSource = eventImages[eventIndex % eventImages.length];

  const isUserApplied = event.userApplication?.status === 'APPLIED';
  const isActionPending =
    applyEventMutation.isPending || cancelEventMutation.isPending;
  const isApplyDisabled = !isUserApplied && availableOptions.length === 0;

  const getButtonText = () => {
    if (isUserApplied) {
      return '신청 취소';
    }
    if (availableOptions.length === 0) {
      return '신청 마감';
    }
    return '신청하기';
  };

  const handleCancelApplication = () => {
    if (!event.userApplication) {
      Alert.alert('오류', '신청 정보를 불러올 수 없습니다.');
      return;
    }
    setIsCancelModalVisible(true);
  };

  const handleCancelConfirm = (reason: string) => {
    if (!event.userApplication) {
      Alert.alert('오류', '신청 정보를 불러올 수 없습니다.');
      return;
    }

    cancelEventMutation.mutate(
      {
        applicationId: event.userApplication.applicationId,
        body: {
          reason,
        },
        eventId: event.id,
      },
      {
        onSuccess: () => {
          Alert.alert('취소 완료', '이벤트 신청이 취소되었습니다.');
          setIsCancelModalVisible(false);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            '신청 취소 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          Alert.alert('취소 실패', errorMessage);
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <DetailHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <EventDetailContent event={event} imageSource={eventImageSource} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.applyButton,
            isUserApplied && styles.cancelButton,
            (isApplyDisabled || isActionPending) && styles.applyButtonDisabled,
          ]}
          onPress={
            isUserApplied ? handleCancelApplication : () => setIsModalVisible(true)
          }
          disabled={isApplyDisabled || isActionPending}>
          <Text
            variant="headlineM"
            color={isApplyDisabled ? '#9CA3AF' : '#FFFFFF'}
            style={styles.applyButtonText}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      </View>

      <EventApplicationModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleApplicationConfirm}
        options={event.options}
        isPending={applyEventMutation.isPending}
      />

      <EventCancelModal
        isVisible={isCancelModalVisible}
        onClose={() => setIsCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
        isPending={cancelEventMutation.isPending}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  applyButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
