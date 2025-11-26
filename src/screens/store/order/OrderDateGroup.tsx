import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../components/common/Text';
import OrderCard, {OrderItem} from './OrderCard';

interface OrderDateGroupProps {
  orderDate: string;
  orders: OrderItem[];
  isLast?: boolean;
}

export default function OrderDateGroup({orderDate, orders, isLast = false}: OrderDateGroupProps) {
  return (
    <View style={[styles.container, !isLast && styles.withBorder]}>
      {/* 주문일시 헤더 */}
      <View style={styles.dateHeader}>
        <Text variant="headlineS" weight="bold">
          {orderDate}
        </Text>
      </View>

      {/* 주문내역 카드들 */}
      <View style={styles.cardsContainer}>
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  withBorder: {
    borderBottomWidth: 10,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  dateHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
});

