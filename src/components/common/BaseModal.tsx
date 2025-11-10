import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from './Text';

interface BaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmButtonText: string;
  children: React.ReactNode;
  height?: number;
  confirmDisabled?: boolean;
}

export default function BaseModal({
  isVisible,
  onClose,
  onConfirm,
  title,
  confirmButtonText,
  children,
  height = 350,
  confirmDisabled = false,
}: BaseModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating>
      <View style={[styles.modalContainer, {height}]}>
        <View style={styles.modalHeader}>
          <Text variant="headlineM" color="#111827" style={styles.modalTitle}>
            {title}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}>
            <Text variant="headlineM" color="#6b7280">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={[
              styles.applyButton,
              confirmDisabled && styles.applyButtonDisabled,
            ]}
            onPress={onConfirm}
            disabled={confirmDisabled}>
            <Text variant="headlineM" color="#FFFFFF" style={styles.applyButtonText}>
              {confirmButtonText}
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
  applyButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

