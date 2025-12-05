import React, {useMemo, useCallback} from 'react';
import {ScrollView, View, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useFocusEffect} from '@react-navigation/native';
import {Text} from '../../../components/common/Text';
import OrderDateGroup from './OrderDateGroup';
import {OrderItem} from './OrderCard';
import DetailHeader from '../../../components/common/DetailHeader';
import {useStoreOrdersList} from '../../../hooks/useStore';

function InfoIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 13.3333V10"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 6.66667H10.0083"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 날짜를 'YY.MM.DD' 형식으로 변환
function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export default function OrderScreen() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useStoreOrdersList();

  // 화면에 진입할 때마다 주문 목록 새로고침
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // API 응답을 OrderItem 형식으로 변환하고 주문일시별로 그룹화
  const groupedOrders = useMemo(() => {
    if (!data) {
      return [];
    }

    const groups: Record<string, OrderItem[]> = {};

    // 모든 페이지의 주문을 순회
    data.pages.forEach(page => {
      page.orders.forEach(order => {
        const orderDate = formatOrderDate(order.purchasedAt);
        
        if (!groups[orderDate]) {
          groups[orderDate] = [];
        }

        const orderItem: OrderItem = {
          id: String(order.orderId),
          itemId: String(order.itemId),
          productName: order.itemName,
          pickupLocation: order.pickupLocation,
          quantity: order.quantity,
          price: order.totalPrice,
          image: order.itemThumbnailUrl
            ? {uri: order.itemThumbnailUrl}
            : require('../../../assets/images/store/fashionmask.png'),
        };

        groups[orderDate].push(orderItem);
      });
    });

    // 주문일시를 최신순으로 정렬
    return Object.entries(groups).sort((a, b) => {
      return b[0].localeCompare(a[0]);
    });
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <DetailHeader title="주문 내역" useTopInset={true} />
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#06B0B7" />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <DetailHeader title="주문 내역" useTopInset={true} />
        <View style={styles.emptyContainer}>
          <Text variant="bodyM" color="#6B7280" style={styles.stateText}>
            주문 내역을 불러오지 못했습니다.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text variant="labelM" color="#FFFFFF">
              다시 시도
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (groupedOrders.length === 0) {
    return (
      <View style={styles.container}>
        <DetailHeader title="주문 내역" useTopInset={true} />
        <View style={styles.emptyContainer}>
          <Text variant="bodyM" color="#999">
            주문내역이 없습니다.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DetailHeader title="주문 내역" useTopInset={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={({nativeEvent}) => {
          const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }
        }}
        scrollEventThrottle={400}>
        <View style={styles.noticeSection}>
          <View style={styles.noticeContent}>
            <View style={styles.noticeIcon}>
              <InfoIcon />
            </View>
            <Text variant="bodyS" color="#374151" weight="regular" style={styles.noticeText}>
              주문 변경 및 취소가 필요하시면 다시입다로 문의해 주세요
            </Text>
          </View>
        </View>
        {groupedOrders.map(([orderDate, orders], index) => (
          <OrderDateGroup
            key={orderDate}
            orderDate={orderDate}
            orders={orders}
            isLast={index === groupedOrders.length - 1 && !hasNextPage}
          />
        ))}
        {isFetchingNextPage && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#06B0B7" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  noticeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  noticeContent: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noticeIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  noticeText: {
    flex: 1,
    textAlignVertical: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#06B0B7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

