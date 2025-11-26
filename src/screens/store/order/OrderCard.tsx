import React from 'react';
import {View, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {Text} from '../../../components/common/Text';

export interface OrderItem {
  id: string;
  productName: string;
  pickupLocation: string;
  quantity: number;
  price: number;
  image: ImageSourcePropType;
}

interface OrderCardProps {
  order: OrderItem;
}

export default function OrderCard({order}: OrderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* 상품 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={order.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* 상품 정보 영역 */}
        <View style={styles.infoArea}>
          {/* 주문 상품 정보 */}
          <View style={styles.productInfo}>
            <Text variant="bodyM" color="#111827" style={styles.productName}>
              {order.productName}
            </Text>
          </View>

          {/* 수령 장소 */}
          <View style={styles.infoRow}>
            <Text variant="bodyS" color="#6B7280">
              수령 장소
            </Text>
            <Text variant="bodyS" color="#111827" style={styles.infoValue}>
              {order.pickupLocation}
            </Text>
          </View>

          {/* 수량 */}
          <View style={styles.infoRow}>
            <Text variant="bodyS" color="#6B7280">
              수량
            </Text>
            <Text variant="bodyS" color="#111827" style={styles.infoValue}>
              {order.quantity}개
            </Text>
          </View>

          {/* 가격 */}
          <View style={styles.priceRow}>
            <Text variant="bodyS" color="#6B7280">
              가격
            </Text>
            <View style={styles.priceContainer}>
              <Text variant="bodyM" color="#06B0B7" style={styles.coinLabel}>
                C
              </Text>
              <Text variant="bodyM" color="#06B0B7">
                {order.price.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productInfo: {
    marginBottom: 8,
  },
  productName: {
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoValue: {
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinLabel: {
    marginRight: 2,
    fontWeight: '700',
  },
});

