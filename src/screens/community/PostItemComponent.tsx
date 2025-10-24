import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {Text} from '../../components/common/Text';

export interface PostItemProps {
  id: string;
  category: '질문' | '후기';
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  image?: ImageSourcePropType;
  likeCount: number;
  commentCount: number;
  onPress?: () => void;
  onLikePress?: () => void;
  onCommentPress?: () => void;
}

export function PostItemComponent({
  category,
  author,
  timeAgo,
  title,
  content,
  image,
  likeCount,
  commentCount,
  onPress,
  onLikePress,
  onCommentPress,
}: PostItemProps) {
  const hasImage = !!image;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <View
            style={[
              styles.categoryTag,
              {backgroundColor: '#06b0b7'},
              category === '질문' && styles.categoryTagWide,
            ]}>
            <Text variant="bodyS" color="#FFFFFF" align="center">
              {category}
            </Text>
          </View>
          <View style={styles.authorInfo}>
            <Text variant="bodyM" color="#6B7280" style={styles.authorName}>
              {author}
            </Text>
            <Text variant="bodyS" color="#9CA3AF" style={styles.timeAgo}>
              {timeAgo}
            </Text>
          </View>
        </View>
      </View>

      {/* 제목 */}
      <View style={styles.titleContainer}>
        <Text variant="headlineS" color="#111827" numberOfLines={2}>
          {title}
        </Text>
      </View>

      {/* 내용과 이미지 영역 */}
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.contentTextContainer,
            hasImage && styles.contentWithImage,
          ]}>
          <Text variant="bodyM" color="#6B7280" style={styles.contentText}>
            {content}
          </Text>
        </View>
        {hasImage && (
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.image} resizeMode="cover" />
          </View>
        )}
      </View>

      {/* 하단 액션 버튼들 */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
          <View style={styles.actionIcon}>
            {/* 좋아요 아이콘 - 실제로는 SVG 아이콘을 사용해야 함 */}
            <View style={styles.heartIcon} />
          </View>
          <Text variant="bodyM" color="#6B7280" style={styles.actionText}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <View style={styles.actionIcon}>
            {/* 댓글 아이콘 - 실제로는 SVG 아이콘을 사용해야 함 */}
            <View style={styles.commentIcon} />
          </View>
          <Text variant="bodyM" color="#6B7280" style={styles.actionText}>
            {commentCount}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 13,
    marginBottom: 1,
  },
  header: {
    marginBottom: 12,
  },
  categoryContainer: {
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
    minWidth: 36,
  },
  categoryTagWide: {
    minWidth: 40,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    height: 24,
  },
  authorName: {
    marginRight: 8,
  },
  timeAgo: {
    // 시간 텍스트 스타일
  },
  titleContainer: {
    marginBottom: 8,
  },
  contentContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contentTextContainer: {
    flex: 1,
  },
  contentWithImage: {
    marginRight: 8,
  },
  contentText: {
    lineHeight: 20,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  heartIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#D1D5DB', // 임시 색상 - 실제로는 SVG 아이콘
    borderRadius: 2,
  },
  commentIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#D1D5DB', // 임시 색상 - 실제로는 SVG 아이콘
    borderRadius: 2,
  },
  actionText: {
    // 액션 텍스트 스타일
  },
});
