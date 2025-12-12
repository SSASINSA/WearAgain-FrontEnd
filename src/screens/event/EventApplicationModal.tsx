import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
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
  optionDepth: number;
  isPending?: boolean;
}

// 선택된 옵션 경로를 추적하는 타입
type SelectedOptionPath = (number | null)[];

export default function EventApplicationModal({
  isVisible,
  onClose,
  onConfirm,
  options,
  optionDepth,
  isPending = false,
}: EventApplicationModalProps) {
  // 각 레벨별로 선택된 옵션 ID를 저장 (null은 선택 안함을 의미)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionPath>(
    Array(optionDepth).fill(null),
  );
  const [memo, setMemo] = useState('');
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isVisible) {
      setSelectedOptions(Array(optionDepth).fill(null));
      setMemo('');
      setOpenDropdownIndex(null);
    }
  }, [isVisible, optionDepth]);

  const handleClose = () => {
    setSelectedOptions(Array(optionDepth).fill(null));
    setMemo('');
    setOpenDropdownIndex(null);
    onClose();
  };

  // 특정 레벨의 옵션 목록을 가져오는 함수
  const getOptionsForLevel = (level: number): EventOption[] => {
    if (level === 0) {
      return options;
    }

    // 이전 레벨까지의 선택 경로를 따라가기
    let currentOptions = options;
    for (let i = 0; i < level; i++) {
      const selectedId = selectedOptions[i];
      if (selectedId === null) {
        return [];
      }
      const selectedOption = currentOptions.find(
        opt => opt.optionId === selectedId,
      );
      if (!selectedOption || !selectedOption.children) {
        return [];
      }
      currentOptions = selectedOption.children;
    }
    return currentOptions;
  };

  // 특정 레벨에서 옵션 선택
  const handleOptionSelect = (level: number, optionId: number | null) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[level] = optionId;
    // 선택된 레벨 이후의 모든 선택을 초기화
    for (let i = level + 1; i < optionDepth; i++) {
      newSelectedOptions[i] = null;
    }
    setSelectedOptions(newSelectedOptions);
    setOpenDropdownIndex(null);
  };

  // 최종 선택된 옵션 ID를 찾는 함수 (가장 깊은 레벨의 선택된 옵션)
  const getFinalOptionId = (): number | null => {
    // 가장 깊은 레벨부터 역순으로 확인하여 선택된 옵션을 찾음
    for (let i = optionDepth - 1; i >= 0; i--) {
      if (selectedOptions[i] !== null) {
        return selectedOptions[i];
      }
    }
    return null;
  };

  const handleConfirm = () => {
    const finalOptionId = getFinalOptionId();
    if (finalOptionId === null) {
      return;
    }
    onConfirm(finalOptionId, memo.trim());
  };

  const finalOptionId = getFinalOptionId();
  const confirmDisabled = finalOptionId === null || isPending;

  // 각 레벨별로 드롭다운 렌더링
  const renderOptionDropdown = (level: number) => {
    const levelOptions = getOptionsForLevel(level);
    const selectedOptionId = selectedOptions[level];
    const isOpen = openDropdownIndex === level;

    // 선택 가능한 옵션 필터링 (remainingCount > 0인 옵션)
    const availableOptions = levelOptions.filter(option => {
      if (option.capacity === null) {
        return true; // capacity가 null이면 항상 선택 가능
      }
      return (option.remainingCount ?? 0) > 0;
    });

    const selectedOption = levelOptions.find(
      opt => opt.optionId === selectedOptionId,
    );

    // 이전 레벨이 선택되지 않았거나 옵션이 없으면 드롭다운 비활성화
    const isDisabled = level > 0 && selectedOptions[level - 1] === null;
    const hasOptions = availableOptions.length > 0;

    return (
      <View key={level} style={styles.optionSection}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              (isDisabled || !hasOptions) && styles.dropdownButtonDisabled,
            ]}
            onPress={() => {
              if (!isDisabled && hasOptions) {
                setOpenDropdownIndex(isOpen ? null : level);
              }
            }}
            disabled={isDisabled || !hasOptions}>
            <Text
              variant="bodyM"
              color={
                isDisabled || !hasOptions
                  ? '#9CA3AF'
                  : selectedOptionId
                  ? '#111827'
                  : '#6b7280'
              }
              style={styles.dropdownButtonText}>
              {isDisabled
                ? '이전 옵션을 먼저 선택해주세요'
                : !hasOptions
                ? '선택 가능한 옵션이 없습니다'
                : selectedOption
                ? selectedOption.name
                : '옵션을 선택해주세요'}
            </Text>
            {hasOptions && !isDisabled && (
              <Text style={styles.dropdownArrow}>
                {isOpen ? '▲' : '▼'}
              </Text>
            )}
          </TouchableOpacity>

          {isOpen && hasOptions && !isDisabled && (
            <View style={styles.dropdownList}>
              <ScrollView
                style={styles.dropdownScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}>
                {availableOptions.map(option => (
                  <TouchableOpacity
                    key={option.optionId}
                    style={styles.dropdownItem}
                    onPress={() => handleOptionSelect(level, option.optionId)}>
                    <View style={styles.optionItemContent}>
                      <Text
                        variant="bodyM"
                        color="#111827"
                        style={styles.dropdownItemText}>
                        {option.name}
                      </Text>
                      {option.capacity !== null && (
                        <Text
                          variant="bodyS"
                          color="#6b7280"
                          style={styles.optionCapacity}>
                          잔여: {option.remainingCount}/{option.capacity}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };

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

            <View style={[styles.modalContent, styles.modalContentContainer]}>
              {/* 옵션 선택 - 각 레벨별로 드롭다운 생성 */}
              {Array.from({length: optionDepth}).map((_, index) =>
                renderOptionDropdown(index),
              )}

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
            </View>

            {Platform.OS === 'ios' ? (
              <SafeAreaView style={styles.modalFooter} edges={['bottom']}>
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    confirmDisabled && styles.applyButtonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={confirmDisabled}>
                  <Text
                    variant="headlineM"
                    color="#FFFFFF"
                    style={styles.applyButtonText}>
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
                  <Text
                    variant="headlineM"
                    color="#FFFFFF"
                    style={styles.applyButtonText}>
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
    alignItems: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomWidth: 0,
    width: '100%',
    maxHeight: '90%',
    alignSelf: 'flex-end',
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
    flexGrow: 0,
    flexShrink: 1,
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionalLabel: {
    fontSize: 12,
    marginLeft: 8,
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
  dropdownButtonDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
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
