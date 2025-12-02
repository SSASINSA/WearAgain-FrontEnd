import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {PostItemComponent, PostItemProps} from './PostItemComponent';
import {useCommunityPosts} from '../../hooks/useCommunityPosts';
import {
  CommunityPost,
  toggleCommunityPostLike,
  getPostKeywords,
} from '../../api/communityApi';
import {formatRelativeTime} from '../../utils/formatDate';
import PlusIcon from '../../assets/icons/plus.svg';
import {Text} from '../../components/common/Text';

type FilterType = 'all' | string;

// API 응답을 PostItemProps로 변환
function mapPostToItemProps(post: CommunityPost): PostItemProps {
  return {
    id: post.id.toString(),
    category: post.keyword,
    author: post.author.name,
    timeAgo: formatRelativeTime(post.createdAt),
    title: post.title,
    content: post.content,
    image: post.imageUrl ? {uri: post.imageUrl} : undefined,
    isLiked: post.isLiked,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
  };
}

export default function CommunityScreen() {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [keywords, setKeywords] = useState<string[]>([]);
  const keyword = selectedFilter === 'all' ? null : selectedFilter;
  const {
    posts,
    isLoading,
    isRefreshing,
    hasNext,
    loadMore,
    refresh,
    updatePost,
  } = useCommunityPosts({
    limit: 10,
    keyword,
  });
  const [likingPostIds, setLikingPostIds] = useState<Set<string>>(new Set());
  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const keywordsList = await getPostKeywords();
        setKeywords(keywordsList);
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
        // 기본값으로 폴백
        setKeywords(['질문', '리뷰', '수선']);
      }
    };

    fetchKeywords();
  }, []);

  // 화면이 포커스될 때 리프레시 (키워드 변경과는 무관하게 1번만)
  useFocusEffect(
    React.useCallback(() => {
      refreshRef.current();
    }, []),
  );

  const handlePostPress = (postId: string) => {
    console.log('게시글 클릭:', postId);
    navigation.navigate('PostDetail', {postId});
  };

  const handleLikePress = async (postId: string) => {
    if (likingPostIds.has(postId)) {
      return; // 이미 처리 중인 경우 중복 요청 방지
    }

    try {
      setLikingPostIds(prev => new Set(prev).add(postId));
      const response = await toggleCommunityPostLike(postId);

      // posts 배열에서 해당 post 업데이트
      updatePost(postId, {
        isLiked: response.isLiked,
        likeCount: response.likeCount,
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLikingPostIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  const handleCommentPress = (postId: string) => {
    console.log('댓글 클릭:', postId);
    // TODO: 댓글 페이지로 네비게이션
  };

  const handleCreatePost = () => {
    console.log('게시글 작성');
    navigation.navigate('PostRegister');
  };

  const renderFilterButton = (value: FilterType, label: string) => {
    const isSelected = selectedFilter === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
        onPress={() => setSelectedFilter(value)}
        activeOpacity={0.7}>
        <Text
          variant="labelM"
          color={isSelected ? '#FFFFFF' : '#6B7280'}
          style={styles.filterButtonText}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleEndReached = () => {
    if (hasNext && !isLoading) {
      loadMore();
    }
  };

  const renderPostItem = ({item}: {item: PostItemProps}) => (
    <PostItemComponent
      {...item}
      onPress={() => handlePostPress(item.id)}
      onLikePress={() => handleLikePress(item.id)}
      onCommentPress={() => handleCommentPress(item.id)}
    />
  );

  const postItems = posts.map(mapPostToItemProps);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filterContent}>
          {renderFilterButton('all', '전체')}
          {keywords.map(kw => renderFilterButton(kw, kw))}
        </View>
      </View>
      <FlatList
        data={postItems}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
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
  filterContainer: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
  },
  filterContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#06B0B7',
  },
  filterButtonText: {
    fontWeight: '600',
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
