import React, {useMemo} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {Text} from '../../../components/common/Text';
import OrderDateGroup from './OrderDateGroup';
import {OrderItem} from './OrderCard';
import DetailHeader from '../../../components/common/DetailHeader';
// 더미데이터
const dummyOrders: (OrderItem & {orderDate: string})[] = [
  {
    id: '1',
    orderDate: '24.01.15',
    productName: '패션 마스크',
    pickupLocation: '강남점',
    quantity: 2,
    price: 300,
    image: require('../../../assets/images/store/fashionmask.png'),
  },
  {
    id: '2',
    orderDate: '24.01.15',
    productName: '에코백',
    pickupLocation: '강남점',
    quantity: 1,
    price: 150,
    image: require('../../../assets/images/store/fashionmask.png'),
  },
  {
    id: '3',
    orderDate: '24.01.15',
    productName: '카드 지갑',
    pickupLocation: '홍대점',
    quantity: 1,
    price: 150,
    image: require('../../../assets/images/store/fashionmask.png'),
  },
  {
    id: '4',
    orderDate: '24.01.10',
    productName: '앞치마',
    pickupLocation: '홍대점',
    quantity: 3,
    price: 600,
    image: require('../../../assets/images/store/fashionmask.png'),
  },
  {
    id: '5',
    orderDate: '24.01.05',
    productName: '패션 마스크',
    pickupLocation: '홍대점',
    quantity: 1,
    price: 150,
    image: require('../../../assets/images/store/fashionmask.png'),
  },
  {
    id: '6',
    orderDate: '24.01.05',
    productName: '에코백',
    pickupLocation: '명동점',
    quantity: 2,
    price: 300,
    image: require('../../../assets/images/store/fashionmask.png'),
  },
];

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

export default function OrderScreen() {
  // 주문일시별로 그룹화
  const groupedOrders = useMemo(() => {
    const groups: Record<string, OrderItem[]> = {};

    dummyOrders.forEach(order => {
      if (!groups[order.orderDate]) {
        groups[order.orderDate] = [];
      }
      const {orderDate, ...orderItem} = order;
      groups[order.orderDate].push(orderItem);
    });

    // 주문일시를 최신순으로 정렬
    return Object.entries(groups).sort((a, b) => {
      return b[0].localeCompare(a[0]);
    });
  }, []);

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
        showsVerticalScrollIndicator={false}>
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
            isLast={index === groupedOrders.length - 1}
          />
        ))}
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
});

