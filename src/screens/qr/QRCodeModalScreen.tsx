import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import {Text} from '../../components/common/Text';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface QRCodeModalScreenProps {
  isVisible: boolean;
  onClose: () => void;
  remainingTickets?: number;
  timerSeconds?: number;
  qrValue?: string; // QR 코드에 표시할 값
}

export default function QRCodeModalScreen({
  isVisible,
  onClose,
  remainingTickets = 5,
  timerSeconds = 1800, // 30분 = 1800초
  qrValue = 'https://ssasinsa.co.kr', // 기본 QR 코드 값
}: QRCodeModalScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(timerSeconds);

  useEffect(() => {
    if (!isVisible) {
      setSecondsLeft(timerSeconds);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, timerSeconds]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  // 화면 크기에 맞춘 QR 코드 크기 계산 (화면 너비의 70% 정도, 최대 256px)
  const qrSize = Math.min(screenWidth * 0.7, 150);
  const modalMaxHeight = screenHeight * 0.85;

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
      <View style={[styles.modalContainer, {maxHeight: modalMaxHeight}]}>
        {/* 드래그 핸들 */}
        <View style={styles.dragHandle} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          {/* 남은 티켓 */}
          <Text
            variant="headlineM"
            color="#000000"
            style={styles.remainingTickets}>
            남은 티켓 : {remainingTickets}
          </Text>

          {/* QR 코드 영역 */}
          <View style={styles.qrContainer}>
            <View style={[styles.qrCodeWrapper, {width: qrSize, height: qrSize}]}>
              <QRCode
                value={qrValue}
                size={qrSize}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            </View>

            <Text variant="bodyS" color="#6B7280" style={styles.qrHint}>
              매장에서 QR 코드를 스캔해 주세요
            </Text>

            {/* 타이머 */}
            <View style={styles.timerContainer}>
              <Text variant="labelM" color="#FFFFFF" style={styles.timerText}>
                {formatTime(secondsLeft)}
              </Text>
            </View>
          </View>
        </ScrollView>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomWidth: 0,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 9999,
    marginBottom: 20,
  },
  remainingTickets: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 342,
  },
  qrCodeWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrHint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: '#B7B7B7',
    borderRadius: 9999,
    paddingHorizontal: 18,
    paddingVertical: 6,
    minWidth: 77,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

