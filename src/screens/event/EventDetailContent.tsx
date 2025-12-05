import React, {useState, useRef} from 'react';
import {View, Image, StyleSheet, FlatList} from 'react-native';
import {Text} from '../../components/common/Text';
import CalendarIcon from '../../assets/icons/eventCalendarIcon.svg';
import LocationIcon from '../../assets/icons/eventLocationIcon.svg';
import {EventDetail} from '../../hooks/useEvents';

interface EventDetailContentProps {
  event: EventDetail;
  imageSource?: any;
}

export default function EventDetailContent({
  event,
  imageSource,
}: EventDetailContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // 이미지 타입 정의
  type ImageItem = {
    imageId: number;
    url: string;
    altText: string;
    displayOrder: number;
    isLocal?: boolean;
    source?: any;
  };
  
  // imageSource가 있으면 첫 번째로 추가, 아니면 이벤트에서 내려온 이미지 배열 그대로 사용
  const imagesToDisplay: ImageItem[] = imageSource
    ? [
        {
          imageId: -1,
          url: '',
          altText: '',
          displayOrder: 0,
          isLocal: true,
          source: imageSource,
        },
        ...event.images,
      ]
    : event.images;

  const handleViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderImageItem = ({item}: {item: ImageItem}) => {
    return (
      <View style={styles.imageWrapper}>
        {item.isLocal && item.source ? (
          <Image source={item.source} style={styles.image} />
        ) : (
          <Image source={{uri: item.url}} style={styles.image} />
        )}
      </View>
    );
  };

  return (
    <>
      {/* Hero Images - Carousel */}
      {imagesToDisplay.length > 0 ? (
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={imagesToDisplay}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `image-${item.imageId}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            decelerationRate="fast"
          />
          {imagesToDisplay.length > 1 && (
            <View style={styles.paginationContainer}>
              {imagesToDisplay.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      ) : null}

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
              {event.organizerName && (
                <Text variant="bodyM" color="#6b7280" style={styles.detailSubValue}>
                  주최: {event.organizerName}
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
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  imageWrapper: {
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    lineHeight: 32,
  },
  descriptionSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    marginBottom: 16,
    lineHeight: 28,
  },
  description: {
    lineHeight: 26,
    paddingBottom: 16,
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
