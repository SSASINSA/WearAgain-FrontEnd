import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Text} from '../../components/common/Text';
import SendIcon from '../../assets/icons/send.svg';
import LikeEmptyIcon from '../../assets/icons/like_empty.svg';
import LikeFilledIcon from '../../assets/icons/like_filled.svg';

interface PostDetailInputComponentProps {
  likeCount: number;
  isLiked: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onLikePress: () => void;
  placeholder?: string;
}

export default function PostDetailInputComponent({
  value,
  onChangeText,
  onSend,
  placeholder = '댓글을 입력하세요...',
  isLiked = false,
  likeCount = 0,
  onLikePress,
}: PostDetailInputComponentProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          {onLikePress && (
            <TouchableOpacity
              style={styles.likeButton}
              onPress={onLikePress}
              activeOpacity={0.7}>
              <View style={styles.likeIcon}>
                {isLiked ? (
                  <LikeFilledIcon width={24} height={24} color="#E30505" />
                ) : (
                  <LikeEmptyIcon width={24} height={24} color="#6B7280" />
                )}
              </View>
              <Text variant="bodyS" color="#6B7280" style={styles.likeCount}>
                {likeCount}
              </Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#ADAEB6"
            value={value}
            onChangeText={onChangeText}
            multiline={false}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={onSend}
            activeOpacity={0.7}>
            <SendIcon width={24} height={24} color="#06B0B7" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  likeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    height: 44,
  },
  likeIcon: {
    marginBottom: 2,
  },
  likeCount: {
    fontSize: 12,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Pretendard-Regular',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
