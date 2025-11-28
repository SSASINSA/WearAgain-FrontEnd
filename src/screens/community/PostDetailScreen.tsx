import {
  RouteProp,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import DetailHeader from '../../components/common/DetailHeader';
import {Text} from '../../components/common/Text';
import PostDetailCommentComponent from './PostDetailCommentComponent';
import PostDetailInputComponent from './PostDetailInputComponent';
import {
  getCommunityPostDetail,
  CommunityPostDetail,
  toggleCommunityPostLike,
  getPostComments,
  createPostComment,
  deletePostComment,
  deleteCommunityPost,
  reportCommunityPost,
  Comment,
} from '../../api/communityApi';
import {formatRelativeTime} from '../../utils/formatDate';
import MoreHorizIcon from '../../assets/icons/more_horiz.svg';

export interface PostDetailProps {
  id: string;
  author: string;
  timeAgo: string;
  title: string;
  summary: string;
  image: ImageSourcePropType;
  content: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
}

type CommunityDetailParamList = {
  PostDetail: {
    postId: string;
  };
};

type CommunityDetailRouteProp = RouteProp<
  CommunityDetailParamList,
  'PostDetail'
>;

export default function PostDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<CommunityDetailRouteProp>();
  const {postId} = route.params;
  const [comment, setComment] = useState('');
  const [postData, setPostData] = useState<CommunityPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoadingComments(true);
      const response = await getPostComments(postId, {limit: 10});
      setComments(response.comments);
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
      // 댓글 로드 실패는 조용히 처리 (게시물은 표시)
    } finally {
      setIsLoadingComments(false);
    }
  }, [postId]);

  const fetchPostDetail = useCallback(
    async (showErrorAlert: boolean = true) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCommunityPostDetail(postId);
        setPostData(data);

        // 게시물 로드 후 댓글도 함께 로드
        await fetchComments();
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          '게시물을 불러오는데 실패했습니다.';
        setError(new Error(errorMessage));
        console.error('Failed to fetch post detail:', err);
        if (showErrorAlert) {
          Alert.alert('오류', errorMessage, [
            {
              text: '확인',
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [postId, navigation, fetchComments],
  );

  // 초기 로드
  useEffect(() => {
    fetchPostDetail(true);
  }, [fetchPostDetail]);

  // 화면이 포커스될 때마다 데이터 리프레시 (에러 알림 없이)
  useFocusEffect(
    useCallback(() => {
      fetchPostDetail(false);
    }, [fetchPostDetail]),
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLikePress = async () => {
    if (isLiking || !postData) {
      return; // 이미 처리 중이거나 postData가 없는 경우 중복 요청 방지
    }

    try {
      setIsLiking(true);
      const response = await toggleCommunityPostLike(postId);

      // postData 상태 업데이트
      setPostData(prev =>
        prev
          ? {
              ...prev,
              isLiked: response.isLiked,
              likeCount: response.likeCount,
            }
          : null,
      );
    } catch (error: any) {
      console.error('Failed to toggle like:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '좋아요 처리에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim() || isSubmittingComment) {
      return;
    }

    try {
      setIsSubmittingComment(true);
      await createPostComment(postId, {content: comment.trim()});
      setComment('');
      // 댓글 리스트 리프레시
      await fetchComments();
      // 게시물 상세 정보도 리프레시하여 댓글 수 업데이트
      if (postData) {
        const updatedPostData = await getCommunityPostDetail(postId);
        setPostData(updatedPostData);
      }
    } catch (error: any) {
      console.error('Failed to create comment:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '댓글 등록에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deletePostComment(postId, commentId);
      // 댓글 리스트 리프레시
      await fetchComments();
      // 게시물 상세 정보도 리프레시하여 댓글 수 업데이트
      if (postData) {
        const updatedPostData = await getCommunityPostDetail(postId);
        setPostData(updatedPostData);
      }
    } catch (error: any) {
      console.error('Failed to delete comment:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '댓글 삭제에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    }
  };

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const handleEdit = () => {
    setIsMenuVisible(false);
    navigation.navigate('PostEdit', {postId});
  };

  const handleDelete = () => {
    setIsMenuVisible(false);
    Alert.alert('삭제', '정말 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCommunityPost(postId);
            Alert.alert('완료', '게시물이 삭제되었습니다.', [
              {
                text: '확인',
                onPress: () => navigation.goBack(),
              },
            ]);
          } catch (error: any) {
            console.error('Failed to delete post:', error);
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              '게시물 삭제에 실패했습니다.';
            Alert.alert('오류', errorMessage);
          }
        },
      },
    ]);
  };

  const handleReport = () => {
    setIsMenuVisible(false);
    Alert.alert('신고', '이 게시물을 신고하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '신고',
        style: 'destructive',
        onPress: async () => {
          try {
            // 기본 신고 사유 (추후 사용자 입력으로 변경 가능)
            const reason = '부적절한 게시물';
            await reportCommunityPost(postId, reason);
            Alert.alert('완료', '신고가 접수되었습니다.');
          } catch (error: any) {
            console.error('Failed to report post:', error);
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              '신고 처리에 실패했습니다.';
            Alert.alert('오류', errorMessage);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <DetailHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06b0b7" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !postData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <DetailHeader />
        <View style={styles.errorContainer}>
          <Text variant="bodyM" color="#6B7280">
            게시물을 불러올 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 헤더 영역 */}
      <DetailHeader
        rightElement={
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleMenuPress}
            accessibilityRole="button"
            accessibilityLabel="더보기 메뉴">
            <MoreHorizIcon width={24} height={24} color="#111827" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* 작성자 정보 영역 */}
        <View style={styles.authorSection}>
          <View style={styles.authorInfo}>
            <View style={[styles.categoryTag, {backgroundColor: '#06b0b7'}]}>
              <Text variant="bodyS" color="#FFFFFF" align="center">
                {postData.keyword}
              </Text>
            </View>
            <View style={styles.authorDetails}>
              <Text variant="bodyM" color="#111827">
                {postData.author.name}
              </Text>
              <Text variant="bodyS" color="#6B7280" style={styles.timeAgo}>
                {formatRelativeTime(postData.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* 제목 영역 */}
        <View style={styles.titleSection}>
          <Text
            variant="displayM"
            weight="semiBold"
            color="#111827"
            style={styles.title}>
            {postData.title}
          </Text>
        </View>

        {/* 구분자 */}
        {/* <View style={styles.divider} /> */}

        {/* 이미지 영역 */}
        {postData.imageUrl && (
          <View style={styles.imageSection}>
            <Image
              source={{uri: postData.imageUrl}}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* 본문 영역 */}
        <View style={styles.contentSection}>
          <Text variant="bodyM" color="#374151" style={styles.content}>
            {postData.content}
          </Text>
        </View>

        <PostDetailCommentComponent
          commentCount={postData.commentCount}
          comments={comments}
          onDeleteComment={handleDeleteComment}
        />
      </ScrollView>

      <PostDetailInputComponent
        likeCount={postData.likeCount}
        isLiked={postData.isLiked}
        value={comment}
        onChangeText={setComment}
        onSend={handleSendComment}
        onLikePress={handleLikePress}
        placeholder="댓글을 입력하세요..."
      />

      {/* 메뉴 모달 */}
      <Modal
        isVisible={isMenuVisible}
        onBackdropPress={handleCloseMenu}
        onBackButtonPress={handleCloseMenu}
        style={styles.modal}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating>
        <View style={styles.menuContainer}>
          {postData.isMine && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleEdit}
                activeOpacity={0.7}>
                <Text variant="bodyM" color="#111827">
                  수정
                </Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleDelete}
                activeOpacity={0.7}>
                <Text variant="bodyM" color="#E30505">
                  삭제
                </Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
            </>
          )}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleReport}
            activeOpacity={0.7}>
            <Text variant="bodyM" color="#111827">
              신고하기
            </Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={handleCloseMenu}
            activeOpacity={0.7}>
            <Text variant="bodyM" color="#6B7280">
              취소
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 69,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#6B7280', // 임시 색상
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  authorSection: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  categoryTag: {
    height: 24,
    borderRadius: 9999,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    marginRight: 8,
  },
  authorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgo: {
    marginLeft: 8,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  title: {
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  imageSection: {
    height: 320,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  content: {
    lineHeight: 20,
  },
  bottomBar: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  menuItemLast: {
    paddingTop: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
  },
});
