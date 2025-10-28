import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {Text} from '../../components/common/Text';
import CalendarIcon from '../../assets/icons/eventCalendarIcon.svg';
import LocationIcon from '../../assets/icons/eventLocationIcon.svg';


interface EventDetailProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  address?: string;
  time?: string;
  status: '예정' | '진행중' | '종료';
  imageUrl?: string;
  tags?: string[];
  category?: string;
}

const {width: screenWidth} = Dimensions.get('window');

interface EventDetailContentProps {
  event: EventDetailProps;
}

export default function EventDetailContent({event}: EventDetailContentProps) {
  return (
    <>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        {event.imageUrl && (
          <Image source={{uri: event.imageUrl}} style={styles.image} />
        )}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text variant="displayM" color="#111827" style={styles.title}>
          {event.title}
        </Text>

        {/* Event Description */}
        <View style={styles.descriptionSection}>
          <Text variant="headlineM" color="#111827" style={styles.sectionTitle}>
            행사 소개
          </Text>
          <Text variant="bodyL" color="#374151" style={styles.description}>
            {event.description}
          </Text>
        </View>

        {/* Event Details */}
        <View style={styles.detailsSection}>
          {/* Date and Time */}
          <View style={styles.detailRow}>
            <View style={[styles.iconWrapper, {backgroundColor: 'rgba(6,176,183,0.1)'}]}>
              <CalendarIcon width={15.75} height={18} color="#06B0B7" />
            </View>
            <View style={styles.detailContent}>
              <Text variant="bodyM" color="#6b7280" style={styles.detailLabel}>
                행사 기간
              </Text>
              <Text variant="bodyL" color="#111827" style={styles.detailValue}>
                {event.startDate} - {event.endDate}
              </Text>
              {event.time && (
                <Text variant="bodyM" color="#6b7280" style={styles.detailSubValue}>
                  {event.time}
                </Text>
              )}
            </View>
          </View>

          {/* Location */}
          <View style={styles.detailRow}>
            <View style={[styles.iconWrapper, {backgroundColor: 'rgba(100,44,141,0.1)'}]}>
              <LocationIcon width={13.5} height={18} color="#642C8D" />
            </View>
            <View style={styles.detailContent}>
              <Text variant="bodyM" color="#6b7280" style={styles.detailLabel}>
                행사 장소
              </Text>
              <Text variant="bodyL" color="#111827" style={styles.detailValue}>
                {event.location}
              </Text>
              {event.address && (
                <Text variant="bodyM" color="#6b7280" style={styles.detailSubValue}>
                  {event.address}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 256,
    width: screenWidth,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    lineHeight: 32,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    lineHeight: 28,
  },
  description: {
    lineHeight: 26,
  },
  detailsSection: {
    gap: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    marginBottom: 4,
  },
  detailValue: {
    marginBottom: 4,
    lineHeight: 24,
  },
  detailSubValue: {
    lineHeight: 20,
  },
});
