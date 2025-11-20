import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import StoreHeader from './StoreHeader';
import {Text} from '../../components/common/Text';
import ProductDetailContent, {ProductDetailData} from './ProductDetailContent';
import ProductExchangeModal from './ProductExchangeModal';

type ProductDetailRouteProp = RouteProp<
  {ProductDetail: {productId: string}},
  'ProductDetail'
>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const {productId} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  // TODO: 실제로는 productId를 기반으로 API에서 데이터를 가져와야 함
  const product: ProductDetailData = {
    id: productId,
    name: '패션 마스크',
    price: 150,
    description: `이 마스크는 업사이클링 과정을 거쳐 제작되었습니다. 소재는 100% 재활용 가능한 원료로, 환경 보호에 기여합니다.`,
    image: require('../../assets/images/store/fashionmask.png'),
  };

  const handleExchange = () => {
    setIsModalVisible(true);
  };

  const handleConfirmExchange = (location: string) => {
    console.log('교환하기 확인:', productId, {location});
    // TODO: 교환 API 호출
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StoreHeader credit={99999} showTitle={false} backgroundColor="#FFFFFF" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProductDetailContent product={product} />
      </ScrollView>

      {/* 하단 고정 버튼 (EventDetailScreen 스타일) */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleExchange}
          activeOpacity={0.8}>
          <Text variant="headlineM" color="#FFFFFF" style={styles.applyButtonText}>
            C {product.price.toLocaleString()}로 교환하기
          </Text>
        </TouchableOpacity>
      </View>

      <ProductExchangeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmExchange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 95,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#8a3fb8',
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

