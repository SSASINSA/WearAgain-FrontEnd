import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Text} from '../../components/common/Text';
import ProductCard from './product/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoreHeader from './StoreHeader';

export default function StoreScreen() {
  const products = [
      {
        id: '1',
        name: '패션 마스크',
        price: 150,
        image: require('../../assets/images/store/fashionmask.png'),
      },
      {
        id: '2',
        name: '카드 지갑',
        price: 150,
        image: require('../../assets/images/store/fashionmask.png'),
      },
      {
        id: '3',
        name: '에코백',
        price: 150,
        image: require('../../assets/images/store/fashionmask.png'),
      },
      {
        id: '4',
        name: '앞치마',
        price: 200,
        image: require('../../assets/images/store/fashionmask.png'),
      },
    ];

  if (!products.length) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text variant="bodyM" color="#999">상품이 없습니다.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 헤더 영역 */}
      <StoreHeader credit={99999} />

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {products.map(product => (
            <View key={product.id} style={styles.itemWrapper}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  itemWrapper: {
    flex: 1,
    minWidth: '40%',
    maxWidth: '48%',
  },
});
