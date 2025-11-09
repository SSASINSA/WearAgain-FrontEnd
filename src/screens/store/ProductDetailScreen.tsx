import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import StoreHeader from './StoreHeader';
import {Text} from '../../components/common/Text';
import ProductDetailContent, {ProductDetailData} from './ProductDetailContent';
import BaseModal from '../../components/common/BaseModal';

type ProductDetailRouteProp = RouteProp<
  {ProductDetail: {productId: string}},
  'ProductDetail'
>;

interface ProductExchangeOptions {
  locations?: string;
}

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const {productId} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // TODO: 실제로는 productId를 기반으로 API에서 데이터를 가져와야 함
  const product: ProductDetailData = {
    id: productId,
    name: '업사이클링 지갑',
    price: 2500,
    description: `이 지갑은 업사이클링 과정을 거쳐 제작되었습니다. 소재는 100% 재활용 가능한 원료로, 환경 보호에 기여합니다.`,
    image: require('../../assets/images/login/login-illustration.png'),
  };

  const handleExchange = () => {
    setIsModalVisible(true);
  };

  const handleConfirmExchange = () => {
    const options: ProductExchangeOptions = {
      locations: selectedLocation,
    };
    console.log('교환하기 확인:', productId, options);
    // TODO: 교환 API 호출
    setIsModalVisible(false);
    setSelectedLocation('');
    setIsLocationDropdownOpen(false);
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

      <BaseModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedLocation('');
          setIsLocationDropdownOpen(false);
        }}
        onConfirm={handleConfirmExchange}
        title="수령 장소 선택"
        confirmButtonText="교환 신청"
        height={350}>
        <View style={styles.optionSection}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}>
              <Text variant="bodyM" color={selectedLocation ? "#111827" : "#6b7280"} style={styles.dropdownButtonText}>
                {selectedLocation || '장소를 선택해주세요'}
              </Text>
              <Text style={styles.dropdownArrow}>
                {isLocationDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {isLocationDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView 
                  style={styles.dropdownScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}>
                  {['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'].map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedLocation(location);
                        setIsLocationDropdownOpen(false);
                      }}>
                      <Text variant="bodyM" color="#111827" style={styles.dropdownItemText}>
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </BaseModal>
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
  optionSection: {
    marginBottom: 24,
  },
  dropdownContainer: {
    marginBottom: 0,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 14,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 4,
    maxHeight: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
  },
  dropdownScrollView: {
    maxHeight: 150,
  },
});

