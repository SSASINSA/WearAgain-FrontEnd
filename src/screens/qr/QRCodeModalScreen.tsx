import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import {Text} from '../../components/common/Text';
import {useTicketsQr} from '../../hooks/useTickets';


interface QRCodeModalScreenProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function QRCodeModalScreen({
  isVisible,
  onClose,
}: QRCodeModalScreenProps) {
  const {data, isLoading, refetch} = useTicketsQr(isVisible);

  const ticketCount = data?.ticketCount ?? 0;
  const qrValue = data?.ticketToken ?? '';
  const timerSeconds = data?.ticketTokenExpiresIn ?? 0;
  const [secondsLeft, setSecondsLeft] = useState(timerSeconds);

  // 모달이 열릴 때마다 API 호출
  useEffect(() => {
    if (isVisible) {
      refetch();
    }
  }, [isVisible, refetch]);

  // 타이머 카운트다운
  useEffect(() => {
    if (!isVisible || !timerSeconds) {
      return;
    }

    // timerSeconds가 변경될 때마다 secondsLeft 초기화
    setSecondsLeft(timerSeconds);

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

  // 화면 크기에 맞춘 QR 코드 크기 계산 (화면 너비의 70% 정도, 최대 150px)
  const qrSize = 150;

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
      <View style={styles.modalContainer}>
        {/* 드래그 핸들 */}
        <View style={styles.dragHandle} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          ) : (
            <>
              {/* 남은 티켓 */}
              <View style={styles.headerContainer}>
                <Text
                  variant="headlineM"
                  color="#000000"
                  style={styles.remainingTickets}>
                  남은 티켓 : {ticketCount}
                </Text>
              </View>

              {/* QR 코드 영역 */}
              <View style={styles.qrContainer}>
                {qrValue ? (
                  <View style={[styles.qrCodeWrapper, {width: qrSize, height: qrSize}]}>
                    <QRCode
                      value={qrValue}
                      size={qrSize}
                      backgroundColor="#FFFFFF"
                      color="#000000"
                    />
                  </View>
                ) : (
                  <View style={[styles.qrCodeWrapper, {width: qrSize, height: qrSize}]}>
                    <ActivityIndicator size="large" color="#000000" />
                  </View>
                )}

                <Text variant="bodyS" color="#6B7280" style={styles.qrHint}>
                  매장에서 QR 코드를 스캔해 주세요
                </Text>

                {/* 타이머 */}
                {timerSeconds > 0 && (
                  <View style={styles.timerContainer}>
                    <Text variant="labelM" color="#FFFFFF" style={styles.timerText}>
                      {formatTime(secondsLeft)}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
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
    width: '100%',
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
  headerContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  remainingTickets: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
});

