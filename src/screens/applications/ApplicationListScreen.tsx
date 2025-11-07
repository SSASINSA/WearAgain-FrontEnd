import React from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DetailHeader from '../../components/common/DetailHeader';
import {ApplicationHistoryCard} from './ApplicationHistoryCard';
import {ApplicationHistory} from './types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ApplicationsStackParamList} from '../../app/navigation/types';

const baseGuide = [
  '깨끗한 옷을 행사장으로 들고옵니다.',
  '행사장 입구에서 가져온 옷을 QR 로 등록합니다.',
  '등록 후 교환 티켓이 잘 들어왔는지 확인합니다.',
  '교환 티켓 만큼 행사장에 있는 옷들을 고릅니다.',
  '교환 존에서 담당자에게 QR 제시 후 수령합니다.',
];

const basePrecautions = [
  '가져온 옷은 반드시 세탁 필수!',
  '행사장 내에서 음식물 섭취는 제한될 수 있습니다.',
];

const applications: ApplicationHistory[] = [
  {
    id: 'application-1',
    title: '👕아름다운X수선혁명랩(Lab)',
    description:
      `'교환'과 '수선'으로 끝까지 입는 경험과 실천을 제공하는 지속 가능한 의생활 실험 공간`,
    status: '진행중',
    startDate: '2025년 09월 02일',
    endDate: '09월 20일',
    location: '서울 중구 왕십리로 63 언더스탠드에비뉴',
    address: '서울 성동구 왕십리로 63 언더스탠드에비뉴',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=256&h=256&fit=crop',
    usageGuide: baseGuide,
    precautions: basePrecautions,
    optionTrail: [
      {eventOptionId: 1, name: '9월 2일', type: 'DATE'},
      {eventOptionId: 2, name: '오전 세션', type: 'TIME'},
    ],
    qrToken: 'APPLICATION_TOKEN_1',
    expiresInSeconds: 1800,
  },
  {
    id: 'application-2',
    title: '전국 수선 자랑 공모전 3탄',
    description: '당신의 수선 이야기를 들려주세요',
    status: '진행중',
    startDate: '2025년 09월 08일',
    endDate: '10월 01일',
    location: '아름다운수선혁명 Lab',
    address: '서울 성동구 뚝섬로 273',
    imageUrl:
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=256&h=256&fit=crop',
    usageGuide: baseGuide,
    precautions: basePrecautions,
    optionTrail: [
      {eventOptionId: 3, name: '9월 8일', type: 'DATE'},
      {eventOptionId: 4, name: '오후 세션', type: 'TIME'},
    ],
    qrToken: 'APPLICATION_TOKEN_2',
    expiresInSeconds: 1200,
  },
  {
    id: 'application-3',
    title: '대한민국 순환경제 페스티벌',
    description: '의생활 속 제로웨이스트 실천 이벤트',
    status: '종료',
    startDate: '2025년 07월 02일',
    endDate: '07월 03일',
    location: '코엑스 마곡',
    address: '서울특별시 강남구 영동대로 513',
    imageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=256&h=256&fit=crop',
    usageGuide: baseGuide,
    precautions: basePrecautions,
    optionTrail: [
      {eventOptionId: 5, name: '7월 2일', type: 'DATE'},
      {eventOptionId: 6, name: '하루권', type: 'PASS'},
    ],
    qrToken: 'APPLICATION_TOKEN_3',
    expiresInSeconds: 0,
  },
  {
    id: 'application-4',
    title: '21%파티',
    description: '의생활 속 제로웨이스트 실천 이벤트',
    status: '종료',
    startDate: '2023년 06월 06일',
    endDate: '06월 06일',
    location: '헤이그라운드 성수 시작점',
    address: '서울 성동구 왕십리로 2길 20',
    imageUrl:
      'https://images.unsplash.com/photo-1475274228244-1645d8304a5e?w=256&h=256&fit=crop',
    usageGuide: baseGuide,
    precautions: basePrecautions,
    optionTrail: [
      {eventOptionId: 7, name: '6월 6일', type: 'DATE'},
      {eventOptionId: 8, name: '저녁 파티', type: 'SESSION'},
    ],
    qrToken: 'APPLICATION_TOKEN_4',
    expiresInSeconds: 600,
  },
];

type NavigationProp = NativeStackNavigationProp<
  ApplicationsStackParamList,
  'ApplicationList'
>;

export default function ApplicationListScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handlePressItem = (item: ApplicationHistory) => {
    navigation.navigate('ApplicationDetail', {application: item});
  };

  const renderApplicationItem = ({
    item,
  }: ListRenderItemInfo<ApplicationHistory>) => (
    <ApplicationHistoryCard
      application={item}
      onPress={() => handlePressItem(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <DetailHeader title="신청 내역" useTopInset />
      <View style={styles.container}>
        <FlatList
          data={applications}
          renderItem={renderApplicationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 16,
  },
});
