import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {EventCard} from './EventCard';


const sampleEvents = [
  {
    id: '1',
    title: '2024 테크 이노베이션 컨퍼런스',
    description: '최신 기술 트렌드와 혁신적인 아이디어를 공유하는 프리미엄 컨퍼런스입니다. 업계 최고의 전문가들과 함께 미래 기술에 대해 논의하고, 네트워킹을 통해 새로운 기회를 발견해보세요.',
    startDate: '2024년 12월 15일',
    endDate: '2024년 12월 16일',
    location: '코엑스 컨벤션센터',
    address: '서울특별시 강남구 영동대로 513',
    time: '오전 9:00 - 오후 6:00',
    status: '진행중' as const,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
    tags: ['기술', '컨퍼런스'],
    category: '기술',
  },
  {
    id: '2',
    title: '지속가능한 패션 워크숍',
    description: '친환경 패션과 업사이클링에 대한 실습 워크숍입니다. 직접 옷을 수선하고 새롭게 디자인해보세요.',
    startDate: '2024.12.01',
    endDate: '2024.12.01',
    location: '피우다 스튜디오',
    address: '서울특별시 마포구 홍대입구역',
    time: '오후 2:00 - 오후 5:00',
    status: '예정' as const,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
    tags: ['패션', '업사이클링'],
    category: '패션',
  },
  {
    id: '3',
    title: '패션 업사이클링 마켓',
    description: '중고 의류를 새롭게 만든 업사이클링 제품들을 만나보고 구매할 수 있는 특별한 마켓입니다.',
    startDate: '2024.10.20',
    endDate: '2024.10.22',
    location: '홍대 문화의 거리',
    address: '서울특별시 마포구 홍익로',
    time: '오전 10:00 - 오후 8:00',
    status: '종료' as const,
    imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=200&fit=crop',
    tags: ['패션', '마켓'],
    category: '패션',
  },
];

export default function EventScreen() {
  const navigation = useNavigation<any>();

  const handleEventPress = (event: any) => {
    console.log('이벤트 클릭:', event.id);
    navigation.navigate('EventDetail', {event});
  };

  const renderEventItem = ({item}: {item: any}) => (
    <EventCard
      title={item.title}
      description={item.description}
      startDate={item.startDate}
      endDate={item.endDate}
      location={item.location}
      status={item.status}
      imageUrl={item.imageUrl}
      onPress={() => handleEventPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sampleEvents}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
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
  },
  separator: {
    height: 16,
  },
});
