import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {PostItemComponent, PostItemProps} from '../community/PostItemComponent';
import {useMyComments} from '../../hooks/useMyComments';
import {CommunityPost, toggleCommunityPostLike} from '../../api/communityApi';
import {formatRelativeTime} from '../../utils/formatDate';
import DetailHeader from '../../components/common/DetailHeader';

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

export default function MyCommentsScreen() {
  const navigation = useNavigation<any>();
  const {
    posts,
    isLoading,
    isRefreshing,
    hasNext,
    loadMore,
    refresh,
    updatePost,
  } = useMyComments({
    limit: 10,
  });
  const [likingPostIds, setLikingPostIds] = useState<Set<string>>(new Set());

  // 화면이 포커스될 때 리프레시
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handlePostPress = (postId: string) => {
    const rootNavigation = navigation.getParent()?.getParent();
    if (rootNavigation) {
      (rootNavigation as any).navigate('PostDetail', {postId});
    } else {
      navigation.navigate('PostDetail' as any, {postId});
    }
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
    const rootNavigation = navigation.getParent()?.getParent();
    if (rootNavigation) {
      (rootNavigation as any).navigate('PostDetail', {postId});
    } else {
      navigation.navigate('PostDetail' as any, {postId});
    }
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
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <DetailHeader />
        {isLoading && posts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#06b0b7" />
          </View>
        ) : (
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
            ListFooterComponent={
              isLoading && posts.length > 0 ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#06b0b7" />
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#F2F2F2',
  },
  separator: {
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
