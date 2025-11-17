import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '../../components/common/Text';

export interface Comment {
  id: string;
  author: string;
  timeAgo: string;
  content: string;
}

interface PostDetailCommentComponentProps {
  commentCount: number;
  comments: Comment[];
}

export default function PostDetailCommentComponent({
  commentCount,
  comments,
}: PostDetailCommentComponentProps) {
  return (
    <View style={styles.container}>
      <Text variant="bodyM" color="#111827" style={styles.title}>
        댓글 {commentCount}개
      </Text>

      {comments.map((item, index) => (
        <View key={item.id}>
          <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <Text variant="bodyM" color="#111827">
                {item.author}
              </Text>
              <Text variant="bodyS" color="#6B7280" style={styles.commentTime}>
                {item.timeAgo}
              </Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 30,
  },
  title: {
    marginBottom: 16,
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
    height: 20,
    marginBottom: 4,
  },
  commentTime: {
    marginLeft: 8,
  },
  commentContent: {
    lineHeight: 20,
  },
});
