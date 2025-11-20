import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from '../../components/common/Text';

interface ProductExchangeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (location: string) => void;
  isPending?: boolean;
}

const LOCATIONS = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];

export default function ProductExchangeModal({
  isVisible,
  onClose,
  onConfirm,
  isPending = false,
}: ProductExchangeModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const handleClose = () => {
    setSelectedLocation('');
    setIsLocationDropdownOpen(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      return;
    }
    onConfirm(selectedLocation);
  };

  const confirmDisabled = !selectedLocation || isPending;

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
      hideModalContentWhileAnimating>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text variant="headlineM" color="#111827" style={styles.modalTitle}>
            수령 장소 선택
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}>
            <Text variant="headlineM" color="#6b7280">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.optionSection}>
            <Text variant="bodyL" color="#111827" style={styles.optionTitle}>
              수령 장소
            </Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}>
                <Text
                  variant="bodyM"
                  color={selectedLocation ? '#111827' : '#6b7280'}
                  style={styles.dropdownButtonText}>
                  {selectedLocation || '장소를 선택해주세요'}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {isLocationDropdownOpen ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {isLocationDropdownOpen && (
                <View style={styles.dropdownList}>
                  <ScrollView
                    style={styles.dropdownScrollView}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}>
                    {LOCATIONS.map(location => (
                      <TouchableOpacity
                        key={location}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedLocation(location);
                          setIsLocationDropdownOpen(false);
                        }}>
                        <Text
                          variant="bodyM"
                          color="#111827"
                          style={styles.dropdownItemText}>
                          {location}
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
            style={[
              styles.applyButton,
              confirmDisabled && styles.applyButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={confirmDisabled}>
            <Text variant="headlineM" color="#FFFFFF" style={styles.applyButtonText}>
              교환 신청
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomWidth: 0,
    height: 350,
    width: '100%',
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
    paddingHorizontal: 20,
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
});

