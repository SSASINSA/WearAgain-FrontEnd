import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useRoute, RouteProp, useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '../../components/common/Text';
import EventDetailContent from './EventDetailContent';
import EventApplicationModal from './EventApplicationModal';
import DetailHeader from '../../components/common/DetailHeader';
import {
  useEventDetail,
  useApplyEvent,
} from '../../hooks/useEvents';

export type EventDetailParamList = {
  EventDetail: {
    eventId: string;
  };
};

type EventDetailRouteProp = RouteProp<EventDetailParamList, 'EventDetail'>;

export default function EventDetailScreen() {
  const route = useRoute<EventDetailRouteProp>();
  const {eventId} = route.params;
  const {data: event, isLoading, isError, refetch} = useEventDetail(eventId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const applyEventMutation = useApplyEvent();

  const refetchRef = useRef(refetch);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // 화면이 포커스될 때 리프레시
  useFocusEffect(
    React.useCallback(() => {
      refetchRef.current();
    }, []),
  );

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

  const isActionPending = applyEventMutation.isPending;
  const isEventOpen = event.status === '모집중';
  const isApplyDisabled = !isEventOpen;

  const getButtonText = () => {
    if (!isEventOpen) {
      if (event.status === '예정') {
        return '신청 예정';
      }
      return '신청 마감';
    }
    return '신청하기';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <DetailHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <EventDetailContent event={event} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.applyButton,
            (isApplyDisabled || isActionPending) && styles.applyButtonDisabled,
          ]}
          onPress={() => setIsModalVisible(true)}
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
  applyButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
