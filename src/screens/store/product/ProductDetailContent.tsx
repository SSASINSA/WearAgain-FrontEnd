import React, {useState, useRef} from 'react';
import {View, Image, StyleSheet, FlatList} from 'react-native';
import {Text} from '../../../components/common/Text';

export interface ProductDetailData {
  id: string;
  name: string;
  price: number;
  description: string;
  image: any;
  images?: Array<{
    id: number;
    url: string;
    sortOrder: number;
  }>;
}

interface ProductDetailContentProps {
  product: ProductDetailData;
}

export default function ProductDetailContent({product}: ProductDetailContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // 이미지 타입 정의 (이벤트 상세와 유사하게 구성)
  type ImageItem = {
    imageId: number;
    url: string;
    sortOrder: number;
  };

  // images 배열이 있으면 정렬해서 사용, 없으면 대표 image 사용
  const sortedImages =
    product.images && product.images.length > 0
      ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
      : [];

  const imagesToDisplay: ImageItem[] =
    sortedImages.length > 0
      ? sortedImages.map(img => ({
          imageId: img.id,
          url: img.url,
          sortOrder: img.sortOrder,
        }))
      : product.image
      ? [
          {
            imageId: 0,
            url: product.image?.uri || '',
            sortOrder: 0,
          },
        ]
      : [];

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
        <Image source={{uri: item.url}} style={styles.image} />
      </View>
    );
  };

  return (
    <>
      {/* 상품 이미지 섹션 */}
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

      {/* 상품 정보 섹션 */}
      <View style={styles.infoSection}>
        {/* 상품명 */}
        <View style={styles.productNameContainer}>
          <Text variant="displayM" color="#111827">
            {product.name}
          </Text>
        </View>

        {/* 상품 설명 섹션 */}
        <View style={styles.descriptionSection}>
          <Text variant="headlineM" color="#111827" style={styles.sectionTitle}>
            상품 설명
          </Text>
          <Text variant="bodyM" color="#374151" style={styles.description}>
            {product.description}
          </Text>
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
    backgroundColor: '#E5E7EB',
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
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  productNameContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  descriptionSection: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 23,
  },
});


