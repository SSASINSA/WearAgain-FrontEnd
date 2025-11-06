import React, {useState, useRef, useEffect} from 'react';
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
  Modal,
  FlatList,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {Text} from '../../components/common/Text';
import DetailHeader from '../../components/common/DetailHeader';
import PlusIcon from '../../assets/icons/plus.svg';

type KeywordType = '후기' | '수선' | '질문' | '기타' | null;

interface PhotoNode {
  image: {
    uri: string;
    width: number;
    height: number;
  };
  type: string;
}

export default function PostRegisterScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordType>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [photos, setPhotos] = useState<PhotoNode[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const keywords: KeywordType[] = ['후기', '수선', '질문', '기타'];

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const apiLevel = Platform.Version;
        if (apiLevel >= 33) {
          // Android 13+ (API 33+)
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // Android 12 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    // iOS permissions are handled automatically by the library
    return true;
  };

  const loadPhotos = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      const {edges, page_info} = await CameraRoll.getPhotos({
        first: 50,
        assetType: 'Photos',
        ...(Platform.OS === 'ios' && {groupTypes: 'All'}),
      });

      const photoNodes = edges.map((edge: any) => edge.node);
      setPhotos(photoNodes);
      setEndCursor(page_info.end_cursor || null);
      setHasNextPage(page_info.has_next_page);
      setShowGalleryModal(true);
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('오류', '사진을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const loadMorePhotos = async () => {
    if (!hasNextPage || !endCursor) return;

    try {
      const {edges, page_info} = await CameraRoll.getPhotos({
        first: 50,
        after: endCursor,
        assetType: 'Photos',
        ...(Platform.OS === 'ios' && {groupTypes: 'All'}),
      });

      const photoNodes = edges.map((edge: any) => edge.node);
      setPhotos(prev => [...prev, ...photoNodes]);
      setEndCursor(page_info.end_cursor || null);
      setHasNextPage(page_info.has_next_page);
    } catch (error) {
      console.error('Error loading more photos:', error);
    }
  };

  const handleImageUpload = () => {
    loadPhotos();
  };

  const handleImageSelect = (uri: string) => {
    setSelectedImage(uri);
    setShowGalleryModal(false);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
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
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: selectedImage}}
                    style={styles.uploadedImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={handleImageRemove}>
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
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

      {/* 갤러리 모달 */}
      <Modal
        visible={showGalleryModal}
        animationType="slide"
        onRequestClose={() => setShowGalleryModal(false)}
        statusBarTranslucent={false}>
        <View style={styles.modalWrapper}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={[styles.modalContainer, {paddingTop: insets.top}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>사진 선택</Text>
              <TouchableOpacity
                onPress={() => setShowGalleryModal(false)}
                style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>취소</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={photos}
              numColumns={3}
              keyExtractor={(item, index) => `${item.image.uri}-${index}`}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.photoItem}
                  onPress={() => handleImageSelect(item.image.uri)}>
                  <Image
                    source={{uri: item.image.uri}}
                    style={styles.photoThumbnail}
                  />
                </TouchableOpacity>
              )}
              onEndReached={loadMorePhotos}
              onEndReachedThreshold={0.5}
              contentContainerStyle={styles.photoList}
            />
          </View>
          <View style={{paddingBottom: insets.bottom}} />
        </View>
      </Modal>
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
  imageContainer: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
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
  modalWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Pretendard-Bold',
    fontWeight: '700',
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#8A3FB8',
    fontFamily: 'Pretendard-Regular',
  },
  photoList: {
    padding: 2,
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
});
