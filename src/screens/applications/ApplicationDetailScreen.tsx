import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  ActivityIndicator,
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
} from '../../hooks/useApplications';

type DetailRouteProp = RouteProp<
  ApplicationsStackParamList,
  'ApplicationDetail'
>;

export default function ApplicationDetailScreen() {
  const {
    params: {applicationId, initialData},
  } = useRoute<DetailRouteProp>();

  const {data, isLoading, isError, refetch} = useApplicationDetail(
    applicationId,
    initialData,
  );

  const {
    qrToken,
    secondsLeft,
    isIssuing,
    isExpired,
    reissue,
  } = useApplicationQr(applicationId);

  const [showModal, setShowModal] = React.useState(false);

  const timerLabel =
    qrToken && secondsLeft >= 0 ? formatSeconds(secondsLeft) : '--:--';

  const handleOpenModal = () => {
    if (qrToken) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

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

            <Section title="이용 방법" items={data.usageGuide} />
            <Section title="주의사항" items={data.precautions} />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
});

