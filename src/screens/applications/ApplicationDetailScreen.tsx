import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as RNText,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import DetailHeader from '../../components/common/DetailHeader';
import {ApplicationsStackParamList} from '../../app/navigation/types';
import {Text} from '../../components/common/Text';
import CalendarIcon from '../../assets/icons/eventCalendarIcon.svg';
import LocationIcon from '../../assets/icons/eventLocationIcon.svg';
import {
  useApplicationDetail,
  useApplicationQr,
  useCancelApplication,
} from '../../hooks/useApplications';
import EventCancelModal from '../event/EventCancelModal';

type DetailRouteProp = RouteProp<
  ApplicationsStackParamList,
  'ApplicationDetail'
>;

export default function ApplicationDetailScreen() {
  const {
    params: {applicationId, initialData},
  } = useRoute<DetailRouteProp>();

  const initialEventStatusCode = initialData?.eventStatusCode?.toUpperCase();
  const initialEventStatusLabel = initialData?.status;
  const initialIsClosed =
    initialEventStatusCode === 'CLOSED' ||
    initialEventStatusCode === 'FINISHED' ||
    initialEventStatusCode === 'ENDED' ||
    initialEventStatusLabel === '종료';

  const {data, isLoading, isError, refetch, isFetching} =
    useApplicationDetail(applicationId, initialData);

  const {
    qrToken,
    secondsLeft,
    isIssuing,
    isExpired,
    hasError: qrError,
    errorMessage: qrErrorMessage,
    errorState,
    isDisabled: isQrDisabled,
    reissue,
  } = useApplicationQr(applicationId, {enabled: !initialIsClosed});

  const [showModal, setShowModal] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  const {mutate: cancelApplication, isPending: isCancelling} =
    useCancelApplication();

  const timerLabel =
    qrToken && secondsLeft >= 0 && !qrError
      ? formatSeconds(secondsLeft)
      : '--:--';

  const isCancelable = React.useMemo(() => {
    const eventCode = data.eventStatusCode?.toUpperCase();
    const applicationCode = data.applicationStatusCode?.toUpperCase();
    const isEventOpen = eventCode === 'OPEN' || eventCode === 'RUNNING';
    const isApplied =
      applicationCode === 'APPLIED' || (!applicationCode && data.status === '진행중');
    return isEventOpen && isApplied;
  }, [data.applicationStatusCode, data.eventStatusCode, data.status]);

  const handleOpenModal = () => {
    if (qrToken && !qrError) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleCancelApplication = (reason: string) => {
    cancelApplication(
      {
        applicationId,
        eventId: data.eventId,
        body: {reason},
      },
      {
        onSuccess: () => {
          setShowCancelModal(false);
          Alert.alert('취소 완료', '신청이 취소되었습니다.');
        },
        onError: () => {
          Alert.alert(
            '취소 실패',
            '신청 취소 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
        },
      },
    );
  };

  const isEventClosed =
    data.eventStatusCode?.toUpperCase() === 'CLOSED' ||
    data.eventStatusCode?.toUpperCase() === 'FINISHED' ||
    data.eventStatusCode?.toUpperCase() === 'ENDED';

  const showQrError = (qrError && !isIssuing) || isEventClosed || isQrDisabled;
  const qrVariant = getQrErrorVariant(
    isEventClosed ? 'ended' : errorState,
    qrErrorMessage,
  );

  if (isLoading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6B7280" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyM" color="#6B7280" style={styles.stateText}>
          신청 상세 정보를 불러오지 못했습니다.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text variant="labelM" color="#FFFFFF">
            다시 시도
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <DetailHeader title="신청" useTopInset />
      {isFetching && data ? (
        <View style={styles.inlineLoader}>
          <ActivityIndicator size="small" color="#06B0B7" />
          <Text variant="bodyS" color="#06B0B7">
            새로고침 중
          </Text>
        </View>
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <LinearGradient
            colors={['#D946EF', '#6A34D8']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.hero}>
            <Text
              variant="headlineS"
              color="#FFFFFF"
              style={[styles.heroTitle, styles.heroTitleBold]}>
              {data.title}
            </Text>
            <View style={styles.heroRow}>
              <CalendarIcon width={14} height={14} />
              <Text variant="labelM" color="#FFFFFF" style={styles.heroText}>
                {formatPeriod(data.startDate, data.endDate)}
              </Text>
            </View>
            <View style={styles.heroRow}>
              <LocationIcon width={12} height={14} />
              <Text variant="labelM" color="#FFFFFF" style={styles.heroText}>
                {data.location}
              </Text>
            </View>
            {data.optionTrail.length > 0 && (
              <View style={styles.heroOptions}>
                {data.optionTrail.map(option => (
                  <View
                    key={option.eventOptionId}
                    style={styles.heroOptionBadge}>
                    <Text variant="labelS" color="#FFFFFF">
                      {option.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <Text
              variant="bodyM"
              color="#F5F5F5"
              style={styles.heroDescription}
              numberOfLines={2}>
              {data.description}
            </Text>
          </LinearGradient>

          <View style={styles.body}>
            {showQrError ? (
              <View
                style={[
                  styles.qrBlock,
                  qrVariant.containerStyle,
                ]}>
                <View
                  style={[
                    styles.qrBadge,
                    qrVariant.badgeStyle,
                  ]}>
                  <Text variant="labelS" color={qrVariant.badgeTextColor}>
                    {qrVariant.badgeText}
                  </Text>
                </View>
                <Text
                  variant="headlineS"
                  color="#111827"
                  style={styles.qrErrorTitle}>
                  {qrVariant.title}
                </Text>
                <Text
                  variant="bodyM"
                  color="#6B7280"
                  style={styles.qrErrorMessage}>
                  {qrVariant.message}
                </Text>
                {qrVariant.showRetry && (
                  <TouchableOpacity
                    style={styles.qrErrorRetry}
                    onPress={reissue}
                    disabled={isIssuing}>
                    <Text variant="labelM" color="#FFFFFF">
                      {isIssuing ? '다시 시도 중...' : '다시 시도하기'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.qrBlock}
                activeOpacity={0.8}
                onPress={handleOpenModal}
                disabled={!qrToken}>
                <View style={styles.qrWrapper}>
                  {qrToken ? (
                    <QRCode value={qrToken} size={150} />
                  ) : (
                    <ActivityIndicator size="small" color="#6B7280" />
                  )}
                </View>
                <Text variant="labelL" color="#111827">
                  {timerLabel}
                </Text>
                <Text variant="bodyS" color="#6B7280" style={styles.qrHint}>
                  QR을 누르면 확대해서 볼 수 있어요
                </Text>
                <TouchableOpacity
                  style={[
                    styles.qrRefreshButton,
                    isExpired && styles.qrRefreshButtonDanger,
                  ]}
                  onPress={reissue}
                  disabled={isIssuing}>
                  <Text variant="labelM" color="#FFFFFF">
                    {isIssuing ? '발급 중...' : 'QR 새로고침'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            <Section title="이용 방법" items={data.usageGuide} />
            <Section title="주의사항" items={data.precautions} />

            {isCancelable && (
              <View style={styles.cancelLinkWrapper}>
                <TouchableOpacity
                  hitSlop={{top: 12, bottom: 12, left: 8, right: 8}}
                  onPress={() => setShowCancelModal(true)}
                  disabled={isCancelling}>
                  <Text variant="bodyS" color="#6B7280" style={styles.cancelLink}>
                    방문이 어려우신가요? 신청을 취소할 수 있어요
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={showModal}
        onRequestClose={handleCloseModal}>
        <Pressable style={styles.modalBackdrop} onPress={handleCloseModal}>
          <View style={styles.modalContent}>
            {qrToken ? (
              <QRCode value={qrToken} size={240} />
            ) : (
              <ActivityIndicator size="large" color="#6B7280" />
            )}
            <Text variant="bodyS" color="#6B7280" style={styles.modalHint}>
              화면을 탭하면 닫힙니다
            </Text>
          </View>
        </Pressable>
      </Modal>

      <EventCancelModal
        isVisible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelApplication}
        isPending={isCancelling}
      />
    </View>
  );
}

type SectionProps = {
  title: string;
  items: string[];
};

function Section({title, items}: SectionProps) {
  if (!items.length) {
    return null;
  }
  return (
    <View style={styles.section}>
      <Text
        variant="headlineS"
        color="#111827"
        style={[styles.sectionTitle, styles.sectionTitleBold]}>
        {title}
      </Text>
      {items.map((item, index) => (
        <View key={`${title}-${index}`} style={styles.bulletRow}>
          <View style={styles.bullet} />
          <RNText style={styles.bulletText}>{item}</RNText>
        </View>
      ))}
    </View>
  );
}

function formatPeriod(start: string, end: string) {
  return `${formatKoreanDate(start)} ~ ${formatKoreanDate(end)}`;
}

function formatKoreanDate(value: string) {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return value;
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

type QrErrorState = 'completed' | 'ended' | 'canceled' | 'generic' | null;

function getQrErrorVariant(state: QrErrorState, message?: string | null) {
  const variants = {
    completed: {
      containerStyle: styles.qrBlockSuccess,
      badgeStyle: styles.qrBadgeSuccess,
      badgeText: '체크인 완료',
      badgeTextColor: '#16A34A',
      title: '이미 체크인이 완료된 신청이에요',
      message:
        message ?? '현장 직원에게 문의해 주세요. QR 발급 없이 입장이 완료되었어요.',
      showRetry: false,
    },
    ended: {
      containerStyle: styles.qrBlockWarning,
      badgeStyle: styles.qrBadgeWarning,
      badgeText: '행사 종료',
      badgeTextColor: '#B45309',
      title: '행사가 종료되어 QR을 발급할 수 없어요',
      message: message ?? '다음 행사 일정을 확인해 주세요.',
      showRetry: false,
    },
    canceled: {
      containerStyle: styles.qrBlockError,
      badgeStyle: styles.qrBadgeDanger,
      badgeText: '신청 취소',
      badgeTextColor: '#DC2626',
      title: '신청이 취소되어 QR을 발급할 수 없어요',
      message: message ?? '다시 신청 후 QR을 발급해 주세요.',
      showRetry: false,
    },
    generic: {
      containerStyle: styles.qrBlockError,
      badgeStyle: styles.qrBadgeDanger,
      badgeText: '발급 실패',
      badgeTextColor: '#EF4444',
      title: 'QR 발급이 지연되고 있어요',
      message:
        message ?? '네트워크 상태를 확인한 뒤 다시 시도해주세요.',
      showRetry: true,
    },
  } as const;

  return variants[state ?? 'generic'];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inlineLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 8,
    elevation: 4,
  },
  hero: {
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 20,
  },
  heroTitle: {
    marginBottom: 12,
  },
  heroTitleBold: {
    fontWeight: '700',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  heroText: {
    flex: 1,
  },
  heroDescription: {
    marginTop: 12,
    lineHeight: 20,
  },
  heroOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
  },
  heroOptionBadge: {
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  body: {
    backgroundColor: '#F7F7F9',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  qrBlock: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  qrWrapper: {
    width: 170,
    height: 170,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 9,
    elevation: 3,
  },
  qrHint: {
    marginTop: -6,
  },
  qrRefreshButton: {
    marginTop: 4,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#06B0B7',
  },
  qrRefreshButtonDanger: {
    backgroundColor: '#DC2626',
  },
  qrBlockError: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
  },
  qrBlockSuccess: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
  },
  qrBlockWarning: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
  },
  qrBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  qrBadgeDanger: {
    backgroundColor: '#FFE4E6',
  },
  qrBadgeSuccess: {
    backgroundColor: '#DCFCE7',
  },
  qrBadgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  qrErrorTitle: {
    marginTop: 4,
    fontWeight: '700',
  },
  qrErrorMessage: {
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  qrErrorRetry: {
    marginTop: 14,
    backgroundColor: '#EF4444',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionTitleBold: {
    fontWeight: '700',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111827',
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    color: '#111827',
    fontSize: 12,
    lineHeight: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  stateText: {
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#06B0B7',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 28,
    alignItems: 'center',
  },
  modalHint: {
    marginTop: 12,
  },
  cancelLinkWrapper: {
    marginTop: 4,
    alignItems: 'center',
  },
  cancelLink: {
    textDecorationLine: 'underline',
  },
});
