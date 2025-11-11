import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '../../components/common/Text';
import EventDetailContent from './EventDetailContent';
import BaseModal from '../../components/common/BaseModal';
import DetailHeader from '../../components/common/DetailHeader';
import {useEventDetail, useApplyEvent} from '../../hooks/useEvents';

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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [memo, setMemo] = useState('');
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  const applyEventMutation = useApplyEvent();

  const handleApplicationConfirm = () => {
    if (!event || !selectedOption) {
      Alert.alert('오류', '옵션을 선택해주세요.');
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
          optionId: selectedOption,
          memo: memo.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('신청 완료', '행사 신청이 완료되었습니다.');
          setIsModalVisible(false);
          setSelectedOption(null);
          setMemo('');
          setIsOptionDropdownOpen(false);
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
    option => option.remainingCount > 0,
  );

  const eventIndex = parseInt(eventId) - 1;
  const eventImageSource = eventImages[eventIndex % eventImages.length];

  const getButtonText = () => {
    if (availableOptions.length === 0) {
      return '신청 마감';
    }
    return '신청하기';
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
            availableOptions.length === 0 && styles.applyButtonDisabled,
          ]}
          onPress={() => setIsModalVisible(true)}
          disabled={availableOptions.length === 0}>
          <Text 
            variant="headlineM" 
            color={availableOptions.length === 0 ? "#9CA3AF" : "#FFFFFF"} 
            style={styles.applyButtonText}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      </View>

      <BaseModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedOption(null);
          setMemo('');
          setIsOptionDropdownOpen(false);
        }}
        onConfirm={handleApplicationConfirm}
        title="신청 옵션 선택"
        confirmButtonText="신청 완료"
        height={500}
        confirmDisabled={!selectedOption || applyEventMutation.isPending}>
        {/* 옵션 선택 */}
        <View style={styles.optionSection}>
          <Text variant="bodyL" color="#111827" style={styles.optionTitle}>
            옵션 선택
          </Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setIsOptionDropdownOpen(!isOptionDropdownOpen)}>
              <Text variant="bodyM" color={selectedOption ? "#111827" : "#6b7280"} style={styles.dropdownButtonText}>
                {selectedOption 
                  ? event.options.find(opt => opt.optionId === selectedOption)?.name || '옵션을 선택해주세요'
                  : '옵션을 선택해주세요'}
              </Text>
              <Text style={styles.dropdownArrow}>
                {isOptionDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {isOptionDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView 
                  style={styles.dropdownScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}>
                  {availableOptions.map((option) => (
                    <TouchableOpacity
                      key={option.optionId}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedOption(option.optionId);
                        setIsOptionDropdownOpen(false);
                      }}>
                      <View style={styles.optionItemContent}>
                        <Text variant="bodyM" color="#111827" style={styles.dropdownItemText}>
                          {option.name}
                        </Text>
                        <Text variant="bodyS" color="#6b7280" style={styles.optionCapacity}>
                          잔여: {option.remainingCount}/{option.capacity}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {availableOptions.length === 0 && (
                    <View style={styles.dropdownItem}>
                      <Text variant="bodyM" color="#6b7280" style={styles.dropdownItemText}>
                        선택 가능한 옵션이 없습니다.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* 메모 입력 */}
        <View style={styles.memoSection}>
          <Text variant="bodyL" color="#111827" style={styles.memoTitle}>
            메모 (선택사항)
          </Text>
          <TextInput
            style={styles.memoInput}
            placeholder="메모를 입력해주세요 (예: 동행 1인 포함)"
            placeholderTextColor="#9CA3AF"
            value={memo}
            onChangeText={setMemo}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </BaseModal>
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
    paddingTop: 17,
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
  optionSection: {
    marginBottom: 24,
  },
  optionTitle: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownContainer: {
    marginBottom: 0,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 14,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 4,
    maxHeight: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
  },
  dropdownScrollView: {
    maxHeight: 150,
  },
  optionItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionCapacity: {
    fontSize: 12,
    marginLeft: 8,
  },
  memoSection: {
    marginTop: 24,
  },
  memoTitle: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    backgroundColor: '#FFFFFF',
  },
});
