import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../../components/common/Text';
import BackIcon from '../../assets/icons/back.svg';

interface StoreHeaderProps {
  credit?: number; 
}

export default function StoreHeader({credit = 1250}: StoreHeaderProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <BackIcon width={15.75} height={18} />
      </TouchableOpacity>

      <View style={styles.titleWrap}>
        <Text variant="headlineM" color="#111827" align="center">
          상점
        </Text>
      </View>

      <View style={styles.creditPill}>
        <Text variant="bodyM" color="#FFFFFF" style={styles.creditC}>
          C
        </Text>
        <Text variant="bodyM" color="#FFFFFF">
          {credit.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 55,
    backgroundColor: '#F2F2F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'space-between',
    position: 'relative',
  },
  backButton: {
    width: 31.75,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  creditPill: {
    height: 28,
    paddingHorizontal: 12,
    backgroundColor: '#06B0B7',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creditC: {
    marginRight: 2,
    fontWeight: '700',
  },
});


