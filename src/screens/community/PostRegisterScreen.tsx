import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../../components/common/Text';
import DetailHeader from '../../components/common/DetailHeader';
import PlusIcon from '../../assets/icons/plus.svg';

type KeywordType = '후기' | '수선' | '질문' | '기타' | null;

export default function PostRegisterScreen() {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordType>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const keywords: KeywordType[] = ['후기', '수선', '질문', '기타'];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleImageUpload = () => {
    // TODO: 이미지 업로드 로직 구현
    Alert.alert('이미지 업로드', '이미지 업로드 기능을 구현해주세요.');
  };

  const handleTitleSubmit = () => {
    contentInputRef.current?.focus();
    // 약간의 딜레이 후 스크롤 이동
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({y: 300, animated: true});
    }, 100);
  };

  const handleContentFocus = () => {
    // 내용 입력 필드로 포커스 이동할 때 스크롤
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({y: 350, animated: true});
    }, 100);
  };

  const handleKeywordSelect = (keyword: string) => {
    // 같은 키워드를 클릭하면 선택 해제, 다른 키워드를 클릭하면 선택
    if (selectedKeyword === keyword) {
      setSelectedKeyword(null);
    } else {
      setSelectedKeyword(keyword as KeywordType);
    }
  };

  const handleSubmit = () => {
    if (content.length < 10) {
      Alert.alert('오류', '내용을 최소 10자 이상 입력해주세요.');
      return;
    }

    // TODO: 게시글 등록 API 호출
    Alert.alert('성공', '게시글이 등록되었습니다.');
    navigation.goBack();
  };

  const isSubmitEnabled =
    title.length >= 0 && content.length >= 10 && selectedKeyword !== null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={0}>
        {/* 헤더 영역 */}
        <DetailHeader />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled">
          {/* 이미지 업로드 영역 */}
          <View style={styles.imageUploadSection}>
            <View style={styles.imageUploadContainer}>
              {selectedImage ? (
                <Image
                  source={{uri: selectedImage}}
                  style={styles.uploadedImage}
                />
              ) : (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleImageUpload}>
                  <PlusIcon width={14} height={14} color="#374151" />
                  <Text style={styles.addImageText}>사진 추가</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 제목 입력 영역 */}
          <View style={styles.titleSection}>
            <Text style={styles.sectionLabel}>제목</Text>
            <View style={styles.titleInputContainer}>
              <TextInput
                ref={titleInputRef}
                style={styles.titleInput}
                placeholder="제목을 입력하세요"
                placeholderTextColor="#adaebc"
                value={title}
                onChangeText={setTitle}
                maxLength={20}
                returnKeyType="next"
                onSubmitEditing={handleTitleSubmit}
              />
            </View>
            <View style={styles.inputHelperTitle}>
              <Text style={styles.characterCount}>{title.length}/20</Text>
            </View>
          </View>

          {/* 내용 입력 영역 */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionLabel}>내용</Text>
            <View style={styles.contentInputContainer}>
              <TextInput
                ref={contentInputRef}
                style={styles.contentInput}
                placeholder="내용을 입력하세요..."
                placeholderTextColor="#adaebc"
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={500}
                onFocus={handleContentFocus}
                scrollEnabled={true}
              />
            </View>
            <View style={styles.inputHelperContent}>
              <Text style={styles.helperText}>최소 10자 이상 입력해주세요</Text>
              <Text style={styles.characterCount}>{content.length}/500</Text>
            </View>
          </View>

          {/* 키워드 선택 영역 */}
          <View style={styles.keywordSection}>
            <Text style={styles.sectionLabel}>키워드 선택</Text>
            <View style={styles.keywordContainer}>
              {keywords.map(keyword => (
                <TouchableOpacity
                  key={keyword}
                  style={[
                    styles.keywordButton,
                    selectedKeyword === keyword
                      ? styles.keywordButtonSelected
                      : null,
                  ]}
                  onPress={() => handleKeywordSelect(keyword as string)}>
                  <Text
                    style={[
                      styles.keywordText,
                      selectedKeyword === keyword
                        ? styles.keywordTextSelected
                        : null,
                    ]}>
                    {keyword}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 등록 버튼 */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isSubmitEnabled && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isSubmitEnabled}>
          <Text style={styles.submitButtonText}>등록</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    height: 69,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  backButton: {
    width: 32,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  imageUploadSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  imageUploadContainer: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#6B7280',
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 17,
    paddingVertical: 11,
  },
  addImageIcon: {
    width: 12,
    height: 14,
    backgroundColor: '#9CA3AF',
    borderRadius: 1,
    marginRight: 8,
  },
  addImageText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#374151',
    fontFamily: 'Pretendard-Regular',
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  keywordSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Pretendard-Regular',
    marginBottom: 8,
  },
  titleInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  titleInput: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    padding: 0,
  },
  contentInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 170,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  contentInput: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    padding: 0,
    textAlignVertical: 'top',
    flex: 1,
  },
  inputHelperTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },

  inputHelperContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Pretendard-Regular',
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Pretendard-Regular',
  },
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordButton: {
    backgroundColor: '#CED4DA',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 7,
    minWidth: 55,
    alignItems: 'center',
  },
  keywordButtonSelected: {
    backgroundColor: '#06B0B7',
  },
  keywordText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Pretendard-Regular',
  },
  keywordTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#8A3FB8',
    borderRadius: 12,
    height: 56,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontWeight: '700',
  },
});
