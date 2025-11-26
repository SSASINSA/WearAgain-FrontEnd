import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '../../components/common/Text';
import {EventOption} from '../../hooks/useEvents';

interface EventApplicationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (optionId: number, memo: string) => void;
  options: EventOption[];
  isPending?: boolean;
}

export default function EventApplicationModal({
  isVisible,
  onClose,
  onConfirm,
  options,
  isPending = false,
}: EventApplicationModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [memo, setMemo] = useState('');
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);

  const availableOptions = options.filter(option => (option.remainingCount ?? 0) > 0);

  const handleClose = () => {
    setSelectedOption(null);
    setMemo('');
    setIsOptionDropdownOpen(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedOption) {
      return;
    }
    onConfirm(selectedOption, memo.trim());
  };

  const confirmDisabled = !selectedOption || isPending;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onSwipeComplete={handleClose}
      swipeDirection={['down']}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      avoidKeyboard>
      <SafeAreaProvider>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text variant="headlineM" color="#111827" style={styles.modalTitle}>
                신청 옵션 선택
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}>
                <Text variant="headlineM" color="#6b7280">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              {/* 옵션 선택 */}
              <View style={styles.optionSection}>
                <Text variant="bodyL" color="#111827" style={styles.optionTitle}>
                  옵션 선택
                </Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setIsOptionDropdownOpen(!isOptionDropdownOpen)}>
                    <Text
                      variant="bodyM"
                      color={selectedOption ? '#111827' : '#6b7280'}
                      style={styles.dropdownButtonText}>
                      {selectedOption
                        ? options.find(opt => opt.optionId === selectedOption)?.name ||
                          '옵션을 선택해주세요'
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
                        {availableOptions.map(option => (
                          <TouchableOpacity
                            key={option.optionId}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedOption(option.optionId);
                              setIsOptionDropdownOpen(false);
                            }}>
                            <View style={styles.optionItemContent}>
                              <Text
                                variant="bodyM"
                                color="#111827"
                                style={styles.dropdownItemText}>
                                {option.name}
                              </Text>
                              <Text
                                variant="bodyS"
                                color="#6b7280"
                                style={styles.optionCapacity}>
                                잔여: {option.remainingCount}/{option.capacity}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                        {availableOptions.length === 0 && (
                          <View style={styles.dropdownItem}>
                            <Text
                              variant="bodyM"
                              color="#6b7280"
                              style={styles.dropdownItemText}>
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
            </ScrollView>

            {Platform.OS === 'ios' ? (
              <SafeAreaView style={styles.modalFooter} edges={['bottom']}>
                <TouchableOpacity 
                  style={[
                    styles.applyButton,
                    confirmDisabled && styles.applyButtonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={confirmDisabled}>
                  <Text variant="headlineM" color="#FFFFFF" style={styles.applyButtonText}>
                    신청 완료
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            ) : (
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[
                    styles.applyButton,
                    confirmDisabled && styles.applyButtonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={confirmDisabled}>
                  <Text variant="headlineM" color="#FFFFFF" style={styles.applyButtonText}>
                    신청 완료
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalWrapper: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomWidth: 0,
    height: 470,
    width: '100%'
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
    flex: 1,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 17,
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
  applyButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
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

