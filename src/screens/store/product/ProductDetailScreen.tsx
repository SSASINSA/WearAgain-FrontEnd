import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useRoute, RouteProp, useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import StoreHeader from '../StoreHeader';
import {Text} from '../../../components/common/Text';
import ProductDetailContent, {ProductDetailData} from './ProductDetailContent';
import ProductExchangeModal from './ProductExchangeModal';
import {useStoreItemDetail, useCreateStoreOrder} from '../../../hooks/useStore';

type ProductDetailRouteProp = RouteProp<
  {ProductDetail: {productId: string}},
  'ProductDetail'
>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const {productId} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {mutate: createOrder, isPending} = useCreateStoreOrder();

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useStoreItemDetail(productId);

  const refetchRef = useRef(refetch);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // 화면이 포커스될 때 상품 상세 정보 리프레시
  useFocusEffect(
    React.useCallback(() => {
      refetchRef.current();
    }, []),
  );

  const handleExchange = () => {
    setIsModalVisible(true);
  };

  const handleConfirmExchange = (location: string, quantity: number) => {
    createOrder(
      {
        itemId: Number(productId),
        quantity,
        pickupLocation: location,
      },
      {
        onSuccess: () => {
          Alert.alert('신청 완료', '교환 신청이 완료되었습니다.');
          setIsModalVisible(false);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ??
            '교환 신청 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
          Alert.alert('교환 신청 실패', message);
        },
      },
    );
  };
  if (isLoading || !item) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StoreHeader showTitle={false} backgroundColor="#FFFFFF" />
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#06B0B7" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StoreHeader showTitle={false} backgroundColor="#FFFFFF" />
        <View style={styles.stateContainer}>
          <Text variant="bodyM" color="#6B7280" style={styles.stateText}>
            상품 정보를 불러오지 못했습니다.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text variant="labelM" color="#FFFFFF">
              다시 시도
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const product: ProductDetailData = {
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description,
    image: item.imageUrl
      ? {uri: item.imageUrl}
      : require('../../../assets/images/store/fashionmask.png'),
    images: item.images && item.images.length > 0
      ? item.images.map(img => ({
          id: img.id,
          url: img.url,
          sortOrder: img.sortOrder,
        }))
      : undefined,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StoreHeader showTitle={false} backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <ProductDetailContent product={product} />
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleExchange}
          activeOpacity={0.8}>
          <Text
            variant="headlineM"
            color="#FFFFFF"
            style={styles.applyButtonText}>
            C {item.price.toLocaleString()}로 교환하기
          </Text>
        </TouchableOpacity>
      </View>

      <ProductExchangeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmExchange}
        locations={item.pickupLocations}
        isPending={isPending}
        maxQuantity={item.maxPurchasePerUser}
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
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
});

