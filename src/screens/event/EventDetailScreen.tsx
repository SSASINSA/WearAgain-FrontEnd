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
import BaseModal from '../../components/common/BaseModal';
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
  const [selectedParticipants, setSelectedParticipants] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isParticipantsDropdownOpen, setIsParticipantsDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const handleApplicationConfirm = () => {
    const options: EventApplicationOptions = {
      participants: selectedParticipants,
      time: selectedTime,
    };
    console.log('선택된 옵션:', options);
    setIsModalVisible(false);
    setSelectedParticipants('');
    setSelectedTime('');
    setIsParticipantsDropdownOpen(false);
    setIsTimeDropdownOpen(false);
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

      <BaseModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedParticipants('');
          setSelectedTime('');
          setIsParticipantsDropdownOpen(false);
          setIsTimeDropdownOpen(false);
        }}
        onConfirm={handleApplicationConfirm}
        title="신청 옵션 선택"
        confirmButtonText="신청 완료"
        height={450}>
        {/* 참가 인원 선택 */}
        <View style={styles.optionSection}>
          <Text variant="bodyL" color="#111827" style={styles.optionTitle}>
            참가 인원
          </Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setIsParticipantsDropdownOpen(!isParticipantsDropdownOpen)}>
              <Text variant="bodyM" color={selectedParticipants ? "#111827" : "#6b7280"} style={styles.dropdownButtonText}>
                {selectedParticipants || '인원을 선택해주세요'}
              </Text>
              <Text style={styles.dropdownArrow}>
                {isParticipantsDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {isParticipantsDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView 
                  style={styles.dropdownScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedParticipants(`${count}명`);
                        setIsParticipantsDropdownOpen(false);
                      }}>
                      <Text variant="bodyM" color="#111827" style={styles.dropdownItemText}>
                        {count}명
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* 참가 시간 선택 */}
        <View style={styles.optionSection}>
          <Text variant="bodyL" color="#111827" style={styles.optionTitle}>
            참가 시간
          </Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}>
              <Text variant="bodyM" color={selectedTime ? "#111827" : "#6b7280"} style={styles.dropdownButtonText}>
                {selectedTime || '시간을 선택해주세요'}
              </Text>
              <Text style={styles.dropdownArrow}>
                {isTimeDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {isTimeDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView 
                  style={styles.dropdownScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}>
                  {['오전 9:00', '오전 10:00', '오전 11:00', '오후 12:00', '오후 1:00', '오후 2:00', '오후 3:00', '오후 4:00', '오후 5:00', '오후 6:00'].map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedTime(time);
                        setIsTimeDropdownOpen(false);
                      }}>
                      <Text variant="bodyM" color="#111827" style={styles.dropdownItemText}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
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
});
