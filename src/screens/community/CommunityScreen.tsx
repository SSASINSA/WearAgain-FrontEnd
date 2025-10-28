import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {PostItemComponent, PostItemProps} from './PostItemComponent';
import PlusIcon from '../../assets/icons/plus.svg';

// 샘플 데이터
const samplePosts: PostItemProps[] = [
  {
    id: '1',
    category: '질문',
    author: '김승상',
    timeAgo: '2시간 전',
    title: '이 옷 이번에 내려는데 어때요?',
    content:
      '제가 고등학생때부터 7년 입은 옷이에요.\n깨끗하게 입고 다녔는데 이제 21% 파티에\n내보려고 해요. 혹시 이번 파티에 참여하시면\n이 재킷 가져가실 분 있나요?',
    isLiked: false,
    likeCount: 24,
    commentCount: 12,
  },
  {
    id: '2',
    category: '후기',
    author: '박대얼',
    timeAgo: '4시간 전',
    title: '아름다운X수선혁명Lab 후기',
    content:
      '간단하게 단추 수선만 스스로 할 줄 알았는데\n이번에 수선워크샵을 참여하면서 재봉틀을 사용하는 수선을\n배웠어요. 가르쳐주시는 분이 정말 친절하게 하나하나\n알려주셔서 잘 배울 수 있었어요. 다음에도 참여하고 싶어요.',
    isLiked: true,
    likeCount: 89,
    commentCount: 34,
  },
  {
    id: '3',
    category: '질문',
    author: '이민수',
    timeAgo: '6시간 전',
    title: '이 코트 수선 가능한가요?',
    content:
      '오래된 코트인데 소매 부분이 좀 닳았어요.\n수선이 가능한지 궁금합니다.',
    isLiked: true,
    likeCount: 15,
    commentCount: 8,
  },
  {
    id: '4',
    category: '후기',
    author: '최지영',
    timeAgo: '1일 전',
    title: '수선 후기 공유합니다',
    content:
      '바지 길이 수선 받았는데 정말 깔끔하게 잘 되었어요.\n다음에도 이용하고 싶습니다.',
    isLiked: false,
    likeCount: 42,
    commentCount: 19,
  },
];

export default function CommunityScreen() {
  const navigation = useNavigation<any>();

  const handlePostPress = (postId: string) => {
    console.log('게시글 클릭:', postId);
    navigation.navigate('PostDetail', {postId});
  };

  const handleLikePress = (postId: string) => {
    console.log('좋아요 클릭:', postId);
    // TODO: 좋아요 API 호출
  };

  const handleCommentPress = (postId: string) => {
    console.log('댓글 클릭:', postId);
    // TODO: 댓글 페이지로 네비게이션
  };

  const handleCreatePost = () => {
    console.log('게시글 작성');
    navigation.navigate('PostRegister');
  };

  const renderPostItem = ({item}: {item: PostItemProps}) => (
    <PostItemComponent
      {...item}
      onPress={() => handlePostPress(item.id)}
      onLikePress={() => handleLikePress(item.id)}
      onCommentPress={() => handleCommentPress(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={samplePosts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* 하단 등록 버튼 */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreatePost}
        activeOpacity={0.8}>
        <View style={styles.addIcon}>
          <PlusIcon width={18} height={18} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
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
  createButton: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#06b0b7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  addIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
