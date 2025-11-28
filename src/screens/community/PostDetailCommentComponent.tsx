import React from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {Text} from '../../components/common/Text';
import {Comment} from '../../api/communityApi';
import {formatRelativeTime} from '../../utils/formatDate';

function DeleteIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12 4L4 12M4 4l8 8"
        stroke="#E30505"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface PostDetailCommentComponentProps {
  commentCount: number;
  comments: Comment[];
  onDeleteComment?: (commentId: number) => void;
}

export default function PostDetailCommentComponent({
  commentCount,
  comments,
  onDeleteComment,
}: PostDetailCommentComponentProps) {
  const handleDelete = (commentId: number) => {
    Alert.alert('삭제', '댓글을 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          onDeleteComment?.(commentId);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text variant="bodyM" color="#111827" style={styles.title}>
        댓글 {commentCount}개
      </Text>

      {comments.map((item, index) => (
        <View key={item.id}>
          <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <View style={styles.commentHeaderLeft}>
                <Text variant="bodyM" color="#111827">
                  {item.author.name}
                </Text>
                <Text
                  variant="bodyS"
                  color="#6B7280"
                  style={styles.commentTime}>
                  {formatRelativeTime(item.createdAt)}
                </Text>
              </View>
              {item.isMine && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                  activeOpacity={0.7}>
                  <DeleteIcon />
                </TouchableOpacity>
              )}
            </View>
            <Text variant="bodyM" color="#374151" style={styles.commentContent}>
              {item.content}
            </Text>
          </View>
          {index < comments.length - 1 && (
            <View style={styles.commentDivider} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    marginBottom: 30,
  },
  title: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  commentItem: {
    paddingHorizontal: 16,
  },
  commentDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
    marginBottom: 4,
  },
  commentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  commentTime: {
    marginLeft: 8,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContent: {
    lineHeight: 20,
  },
});
