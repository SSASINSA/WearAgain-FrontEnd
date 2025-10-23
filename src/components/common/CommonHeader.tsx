// components/CommonHeader.tsx
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Text as CustomText} from './Text';
import TicketIcon from '../../assets/icons/ticket.svg';
import StoreIcon from '../../assets/icons/store.svg';

type CommonHeaderProps = {
  onPressTicket?: () => void;
  onPressStore?: () => void;
};

export default function CommonHeader({
  onPressTicket,
  onPressStore,
}: CommonHeaderProps) {
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* 왼쪽 영역 (비워둠: 중앙 정렬을 위한 공간) */}
          <View style={styles.headerLeft} />

          {/* 오른쪽 아이콘 영역 */}
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={onPressTicket} style={styles.iconButton}>
              <TicketIcon width={45} height={45} style={styles.iconImageTicket} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressStore} style={styles.iconButton}>
              <StoreIcon width={30} height={30} style={styles.iconImageStore} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F2F2F2',
  },
  header: {
    height: 55,
    backgroundColor: '#F2F2F2',
    paddingTop: 5,
    paddingHorizontal: 16,
    borderBottomWidth:1,
    borderBottomColor:'#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 8,
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 5,
  },
  iconImageTicket: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  iconImageStore: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
