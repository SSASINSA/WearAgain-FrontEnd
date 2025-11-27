import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Text} from '../../../components/common/Text';

export interface ProductDetailData {
  id: string;
  name: string;
  price: number;
  description: string;
  image: any;
}

interface ProductDetailContentProps {
  product: ProductDetailData;
}

export default function ProductDetailContent({product}: ProductDetailContentProps) {
  return (
    <>
      {/* 상품 이미지 섹션 */}
      <View style={styles.imageSection}>
        <Image source={product.image} style={styles.productImage} resizeMode="cover" />
      </View>

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
  imageSection: {
    aspectRatio: 1,
    backgroundColor: '#E5E7EB',
  },
  productImage: {
    width: '100%',
    height: '100%',
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


