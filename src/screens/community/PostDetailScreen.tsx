import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LikeEmptyIcon from '../../assets/icons/like_empty.svg';
import LikeFilledIcon from '../../assets/icons/like_filled.svg';
import {Text} from '../../components/common/Text';
import PostDetailCommentComponent, {
  Comment,
} from './PostDetailCommentComponent';
import PostDetailInputComponent from './PostDetailInputComponent';

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
  const navigation = useNavigation();
  const route = useRoute<CommunityDetailRouteProp>();
  const {postId} = route.params;
  const [comment, setComment] = useState('');

  // 샘플 데이터 (실제로는 postId를 기반으로 API에서 데이터를 가져와야 함)
  const postData: PostDetailProps = {
    id: postId,
    author: '김민지',
    timeAgo: '2시간 전',
    title: '오늘 방문한 카페가 정말 예뻤어요!',
    summary:
      '오늘 방문한 카페가 정말 예뻤어요! 인테리어도 너무 좋고 커피 맛도 최고였습니다 ☕️',
    image: require('../../assets/images/login/login-illustration.png'), // 임시 이미지
    content:
      '오늘 친구와 함께 새로 오픈한 카페에 다녀왔는데 정말 분위기가 좋았어요! 특히 라떼 아트가 너무 예쁘고 원두도 직접 로스팅해서 그런지 향이 정말 좋았습니다. 디저트로 먹은 티라미수도 달지 않고 부드러워서 커피와 잘 어울렸어요. 인테리어도 인스타그램에 올리기 좋게 꾸며져 있어서 사진도 많이 찍었네요 📸 다음에 또 가고 싶은 곳이에요!',
    isLiked: false,
    likeCount: 124,
    commentCount: 23,
  };

  const comments: Comment[] = [
    {
      id: '1',
      author: '최영수',
      timeAgo: '30분 전',
      content:
        '인테리어 진짜 감각적이네요 👍 다음에 데이트 코스로 좋을 것 같아요',
    },

    {
      id: '2',
      author: '박준호',
      timeAgo: '45분 전',
      content:
        '인테리어 진짜 감각적이네요 👍 다음에 데이트 코스로 좋을 것 같아요',
    },
    {
      id: '3',
      author: '이수진',
      timeAgo: '1시간 전',
      content:
        '인테리어 진짜 감각적이네요 👍 다음에 데이트 코스로 좋을 것 같아요',
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLikePress = () => {
    console.log('좋아요 클릭');
    // TODO: 좋아요 API 호출
  };

  const handleSendComment = () => {
    console.log('댓글 전송:', comment);
    setComment('');
    // TODO: 댓글 API 호출
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}>
          {/* 백 아이콘은 실제로는 SVG 아이콘을 사용해야 함 */}
          <View style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* 작성자 정보 영역 */}
        <View style={styles.authorSection}>
          <View style={styles.authorInfo}>
            <View style={[styles.categoryTag, {backgroundColor: '#06b0b7'}]}>
              <Text variant="bodyS" color="#FFFFFF" align="center">
                질문
              </Text>
            </View>
            <View style={styles.authorDetails}>
              <Text variant="bodyM" color="#111827">
                {postData.author}
              </Text>
              <Text variant="bodyS" color="#6B7280" style={styles.timeAgo}>
                {postData.timeAgo}
              </Text>
            </View>
          </View>
        </View>

        {/* 제목 영역 */}
        <View style={styles.titleSection}>
          <Text variant="headlineL" color="#111827" style={styles.title}>
            {postData.title}
          </Text>
        </View>

        {/* 이미지 영역 */}
        <View style={styles.imageSection}>
          <Image
            source={postData.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* 본문 영역 */}
        <View style={styles.contentSection}>
          <Text variant="bodyM" color="#374151" style={styles.content}>
            {postData.content}
          </Text>
        </View>

        <PostDetailCommentComponent
          commentCount={postData.commentCount}
          comments={comments}
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
});
