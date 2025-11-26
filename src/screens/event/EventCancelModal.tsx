import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from '../../components/common/Text';

interface EventCancelModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending?: boolean;
}

export default function EventCancelModal({
  isVisible,
  onClose,
  onConfirm,
  isPending = false,
}: EventCancelModalProps) {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      return;
    }
    onConfirm(reason.trim());
  };

  const confirmDisabled = !reason.trim() || isPending;

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
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text variant="headlineM" color="#111827" style={styles.modalTitle}>
            신청 취소
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
          <View style={styles.reasonSection}>
            <Text variant="bodyL" color="#111827" style={styles.reasonTitle}>
              취소 사유
            </Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="취소 사유를 입력해주세요 (예: 일정이 변경되었습니다.)"
              placeholderTextColor="#9CA3AF"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={[
              styles.cancelButton,
              confirmDisabled && styles.cancelButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={confirmDisabled}>
            <Text variant="headlineM" color="#FFFFFF" style={styles.cancelButtonText}>
              취소하기
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
  cancelButton: {
    backgroundColor: '#EF4444',
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  reasonSection: {
    marginTop: 8,
  },
  reasonTitle: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 120,
    backgroundColor: '#FFFFFF',
  },
});

