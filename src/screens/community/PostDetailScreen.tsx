import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '../../components/common/Text';

export interface PostDetailProps {
  id: string;
  author: string;
  timeAgo: string;
  title: string;
  summary: string;
  image: ImageSourcePropType;
  content: string;
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
    likeCount: 124,
    commentCount: 23,
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLikePress = () => {
    console.log('좋아요 클릭');
    // TODO: 좋아요 API 호출
  };

  const handleCommentPress = () => {
    console.log('댓글 클릭');
    // TODO: 댓글 입력 모달 또는 페이지로 이동
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
            <Text variant="bodyM" color="#111827">
              {postData.author}
            </Text>
            <Text variant="bodyS" color="#6B7280" style={styles.timeAgo}>
              {postData.timeAgo}
            </Text>
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
      </ScrollView>

      {/* 하단 좋아요/댓글 영역 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleLikePress}
          activeOpacity={0.7}>
          {/* 좋아요 아이콘 - 실제로는 SVG 아이콘을 사용해야 함 */}
          <View style={styles.likeIcon} />
          <Text variant="bodyM" color="#6B7280">
            {postData.likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleCommentPress}
          activeOpacity={0.7}>
          {/* 댓글 아이콘 - 실제로는 SVG 아이콘을 사용해야 함 */}
          <View style={styles.commentIcon} />
          <Text variant="bodyM" color="#6B7280">
            {postData.commentCount}
          </Text>
        </TouchableOpacity>
      </View>
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
    height: 85,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  authorInfo: {
    height: 36,
    justifyContent: 'space-between',
  },
  timeAgo: {
    marginTop: 4,
  },
  titleSection: {
    minHeight: 107,
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 200,
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
  likeIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#D1D5DB', // 임시 색상 - 실제로는 SVG 아이콘
    marginRight: 8,
    borderRadius: 2,
  },
  commentIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#D1D5DB', // 임시 색상 - 실제로는 SVG 아이콘
    marginRight: 8,
    borderRadius: 2,
  },
});
