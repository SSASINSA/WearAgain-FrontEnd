import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from '../../components/common/Text';
import CalendarIcon from '../../assets/icons/eventCalendarIcon.svg';
import LocationIcon from '../../assets/icons/eventLocationIcon.svg';
import {ApplicationHistory, ApplicationStatus} from './types';

type ApplicationHistoryCardProps = {
  application: ApplicationHistory;
  onPress?: () => void;
};

const STATUS_THEME: Record<ApplicationStatus, {background: string; text: string}> = {
  진행중: {
    background: '#FEE2E2',
    text: '#B91C1C',
  },
  종료: {
    background: '#E5E7EB',
    text: '#4B5563',
  },
  예정: {
    background: '#DBEAFE',
    text: '#1D4ED8',
  },
};

export function ApplicationHistoryCard({
  application,
  onPress,
}: ApplicationHistoryCardProps) {
  const theme = STATUS_THEME[application.status];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${application.title} 신청 내역`}>
      <View style={styles.row}>
        <Image
          source={{uri: application.imageUrl}}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text
              variant="headlineS"
              color="#111827"
              style={styles.title}
              numberOfLines={1}>
              {application.title}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: theme.background},
              ]}>
              <Text variant="bodyS" color={theme.text} style={styles.statusText}>
                {application.status}
              </Text>
            </View>
          </View>

          <Text
            variant="bodyM"
            color="#4B5563"
            style={styles.description}
            numberOfLines={2}>
            {application.description}
          </Text>

          <View>
            <View style={styles.metaRow}>
              <View style={styles.metaIcon}>
                <CalendarIcon width={12.25} height={14} />
              </View>
              <Text variant="bodyM" color="#6B7280" style={styles.metaText}>
                {application.startDate} - {application.endDate}
              </Text>
            </View>

            <View style={[styles.metaRow, styles.metaRowSpacing]}>
              <View style={styles.metaIcon}>
                <LocationIcon width={10.5} height={14} />
              </View>
              <Text variant="bodyM" color="#6B7280" style={styles.metaText}>
                {application.location}
              </Text>
            </View>

            <View style={[styles.metaRow, styles.metaRowSpacing]}>
              <View style={styles.metaIcon} />
              <Text
                variant="bodyM"
                color="#9CA3AF"
                style={[styles.metaText, styles.address]}>
                {application.address}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontWeight: '600',
  },
  description: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRowSpacing: {
    marginTop: 6,
  },
  metaIcon: {
    width: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  metaText: {
    flex: 1,
    lineHeight: 18,
  },
  address: {
    color: '#9CA3AF',
  },
});
