import React, {useMemo, useCallback, useState, useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Text} from '../../components/common/Text';
import ProductCard from './product/ProductCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import StoreHeader from './StoreHeader';
import {useStoreItemsList} from '../../hooks/useStore';

export default function StoreScreen() {
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useStoreItemsList({
    size: 20,
  });

  const items = useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data],
  );

  const refetchRef = useRef(refetch);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // 화면이 포커스될 때 리프레시 (스크롤 모션 없이)
  useFocusEffect(
    React.useCallback(() => {
      refetchRef.current();
    }, []),
  );

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#06B0B7" />
      </View>
    );
  };

  const renderStateView = (message: string, showRetry?: boolean) => (
    <View style={styles.stateContainer}>
      <Text variant="bodyM" color="#6B7280" style={styles.stateText}>
        {message}
      </Text>
      {showRetry ? (
        <View style={styles.retryButton}>
          <Text variant="labelM" color="#FFFFFF">
            다시 시도
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 헤더 영역 */}
      <StoreHeader />

      {isLoading && items.length === 0 ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#06B0B7" />
        </View>
      ) : isError && items.length === 0 ? (
        renderStateView('상점을 불러오지 못했습니다.', true)
      ) : items.length === 0 ? (
        renderStateView('현재 판매 중인 상품이 없습니다.')
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.itemWrapper}>
              <ProductCard
                product={{
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.thumbnailUrl
                    ? {uri: item.thumbnailUrl}
                    : require('../../assets/images/store/fashionmask.png'),
                }}
              />
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isManualRefreshing} onRefresh={handleRefresh} />
          }
        />
      )}
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
  itemWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
