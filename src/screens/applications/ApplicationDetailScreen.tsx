import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ScrollView, StyleSheet, View, Text as RNText} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import DetailHeader from '../../components/common/DetailHeader';
import {ApplicationsStackParamList} from '../../app/navigation/types';
import {Text} from '../../components/common/Text';
import CalendarIcon from '../../assets/icons/eventCalendarIcon.svg';
import LocationIcon from '../../assets/icons/eventLocationIcon.svg';

type DetailRouteProp = RouteProp<
  ApplicationsStackParamList,
  'ApplicationDetail'
>;

export default function ApplicationDetailScreen() {
  const {params} = useRoute<DetailRouteProp>();
  const {application} = params;

  const formattedPeriod = `${application.startDate} ~ ${application.endDate}`;
  const timerLabel = formatSeconds(application.expiresInSeconds);

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
              {application.title}
            </Text>
            <View style={styles.heroRow}>
              <CalendarIcon width={14} height={14} />
              <Text variant="labelM" color="#FFFFFF" style={styles.heroText}>
                {formattedPeriod}
              </Text>
            </View>
            <View style={styles.heroRow}>
              <LocationIcon width={12} height={14} />
              <Text variant="labelM" color="#FFFFFF" style={styles.heroText}>
                {application.location}
              </Text>
            </View>
            <View style={styles.heroOptions}>
              {application.optionTrail.map(option => (
                <View key={option.eventOptionId} style={styles.heroOptionBadge}>
                  <Text variant="labelS" color="#FFFFFF">
                    {option.name}
                  </Text>
                </View>
              ))}
            </View>
            <Text
              variant="bodyM"
              color="#F5F5F5"
              style={styles.heroDescription}
              numberOfLines={2}>
              {application.description}
            </Text>
          </LinearGradient>

            <View style={styles.body}>
              <View style={styles.qrBlock}>
                <View style={styles.qrWrapper}>
                  <QRCode value={application.qrToken} size={132} />
                </View>
                <Text variant="labelL" color="#111827">
                  {timerLabel}
                </Text>
              </View>

              <Section title="이용 방법" items={application.usageGuide} />
              <Section title="주의사항" items={application.precautions} />
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

type SectionProps = {
  title: string;
  items: string[];
};

function Section({title, items}: SectionProps) {
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
    width: 150,
    height: 150,
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
});
