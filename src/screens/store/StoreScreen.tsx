import React, {useCallback, useMemo} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {Text} from '../../components/common/Text';
import ProductCard from './ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoreHeader from './StoreHeader';

export default function StoreScreen() {
  const products = [
      {
        id: '1',
        name: '패션 마스크',
        price: 150,
        image: '이미지 1',
      },
      {
        id: '2',
        name: '카드 지갑',
        price: 150,
        image: '이미지 2',
      },
      {
        id: '3',
        name: '에코백',
        price: 150,
        image: '이미지 3',
      },
      {
        id: '4',
        name: '앞치마',
        price: 200,
        image: '이미지 4',
      },
    ];

  const renderItem = useCallback(
    ({item}: {item: {id: string; name: string; price: number; image: any}}) => (
      <ProductCard product={item} />
    ),
    [],
  );

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

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 24,
    rowGap: 16,
    alignItems: 'center',
  },
  gridRow: {
    gap: 16,
    justifyContent: 'center',
  },
});
