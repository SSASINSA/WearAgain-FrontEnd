import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text} from '../../components/common/Text';
import CalendarIcon from '../../assets/icons/eventCalendarIcon.svg';
import LocationIcon from '../../assets/icons/eventLocationIcon.svg'; 

interface EventCardProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: '예정' | '모집중' | '마감';
  imageUrl?: string;
  imageSource?: any;
  onPress?: () => void;
}

export function EventCard({
  title,
  description,
  startDate,
  endDate,
  location,
  status,
  imageUrl,
  imageSource,
  onPress,
}: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '예정':
        return '#9333EA';
      case '모집중':
        return '#FF4242';
      case '마감':
        return '#6b7280';
      default:
        return '#06b0b7';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.image} />
        ) : null}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, {backgroundColor: getStatusColor(status)}]}>
            <Text variant="bodyS" color="#FFFFFF" style={styles.statusText}>
              {status}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text variant="headlineS" color="#111827" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        <Text variant="bodyM" color="#6b7280" style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              {/* 달력 아이콘 */}
              <CalendarIcon width={12.25} height={14} color="#6B7280" />
            </View>
            <Text variant="bodyM" color="#6b7280" style={styles.infoText} numberOfLines={2}>
              {startDate} - {endDate}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              {/* 위치 아이콘 */}
              <LocationIcon width={10.5} height={14} color="#6B7280" />
            </View>
            <Text variant="bodyM" color="#6b7280" style={styles.infoText} numberOfLines={2}>
              {location}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    height: 192,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  statusBadge: {
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 37,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  iconContainer: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
});
