import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Text} from '../../components/common/Text';

interface EventApplicationOptions {
  participants?: string;
  time?: string;
}

interface DropdownStates {
  participants: boolean;
  time: boolean;
}

interface EventApplicationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (options: EventApplicationOptions) => void;
}

export default function EventApplicationModal({
  isVisible,
  onClose,
  onConfirm,
}: EventApplicationModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<EventApplicationOptions>({});
  const [dropdownStates, setDropdownStates] = useState<DropdownStates>({
    participants: false,
    time: false,
  });

  const toggleDropdown = (key: keyof DropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectOption = (key: keyof EventApplicationOptions, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [key]: value
    }));
    setDropdownStates(prev => ({
      ...prev,
      [key]: false
    }));
  };

  const handleConfirm = () => {
    onConfirm(selectedOptions);
    setSelectedOptions({});
    setDropdownStates({
      participants: false,
      time: false,
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text variant="headlineM" color="#111827" style={styles.modalTitle}>
              신청 옵션 선택
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}>
              <Text variant="headlineM" color="#6b7280">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* 참가 인원 선택 */}
            <View style={styles.optionSection}>
              <Text variant="bodyL" color="#111827" style={styles.optionTitle}>
                참가 인원
              </Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown('participants')}>
                  <Text variant="bodyM" color={selectedOptions.participants ? "#111827" : "#6b7280"} style={styles.dropdownButtonText}>
                    {selectedOptions.participants || '인원을 선택해주세요'}
                  </Text>
                  <Text style={styles.dropdownArrow}>
                    {dropdownStates.participants ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
                
                {dropdownStates.participants && (
                  <View style={styles.dropdownList}>
                    <ScrollView 
                      style={styles.dropdownScrollView}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                        <TouchableOpacity
                          key={count}
                          style={styles.dropdownItem}
                          onPress={() => selectOption('participants', `${count}명`)}>
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
                  onPress={() => toggleDropdown('time')}>
                  <Text variant="bodyM" color={selectedOptions.time ? "#111827" : "#6b7280"} style={styles.dropdownButtonText}>
                    {selectedOptions.time || '시간을 선택해주세요'}
                  </Text>
                  <Text style={styles.dropdownArrow}>
                    {dropdownStates.time ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
                
                {dropdownStates.time && (
                  <View style={styles.dropdownList}>
                    <ScrollView 
                      style={styles.dropdownScrollView}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}>
                      {['오전 9:00', '오전 10:00', '오전 11:00', '오후 12:00', '오후 1:00', '오후 2:00', '오후 3:00', '오후 4:00', '오후 5:00', '오후 6:00'].map((time) => (
                        <TouchableOpacity
                          key={time}
                          style={styles.dropdownItem}
                          onPress={() => selectOption('time', time)}>
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
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleConfirm}>
              <Text variant="headlineM" color="#FFFFFF" style={styles.applyButtonText}>
                신청 완료
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 450,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomWidth: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 17,
    marginBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
