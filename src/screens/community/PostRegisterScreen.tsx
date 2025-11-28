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
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {Text} from '../../components/common/Text';
import DetailHeader from '../../components/common/DetailHeader';
import PlusIcon from '../../assets/icons/plus.svg';
import {
  uploadCommunityImage,
  createCommunityPost,
} from '../../api/communityApi';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const keywords: string[] = ['후기', '수선', '질문', '기타'];

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
      scrollViewRef.current?.scrollTo({y: 100, animated: true});
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

  const handleSubmit = async () => {
    if (!title.trim() || !selectedKeyword) {
      Alert.alert('입력 오류', '제목과 키워드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // 이미지가 있으면 먼저 업로드
      if (selectedImage) {
        try {
          const uploadResponse = await uploadCommunityImage(selectedImage);
          imageUrl = uploadResponse.imageUrl;
        } catch (error) {
          console.error('Image upload error:', error);
          Alert.alert('오류', '이미지 업로드에 실패했습니다.');
          setIsSubmitting(false);
          return;
        }
      }

      // 게시물 등록
      const postData = {
        title: title.trim(),
        content: content.trim(),
        keyword: selectedKeyword,
        imageUrls: imageUrl ? [imageUrl] : [],
      };

      await createCommunityPost(postData);

      Alert.alert('성공', '게시글이 등록되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Post creation error:', error);
      Alert.alert('오류', '게시글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled = title.length >= 0 && selectedKeyword !== null;

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
          {/* 제목 입력 영역 */}
          <View style={styles.titleSection}>
            <Text variant="headlineL">제목</Text>
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

          {/* 키워드 선택 영역 */}
          <View style={styles.keywordSection}>
            <Text variant="headlineM">키워드 선택</Text>
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

          {/* 이미지와 내용 영역 (가로 배치) */}
          <View style={styles.imageContentRow}>
            {/* 이미지 업로드 영역 */}
            <View style={styles.imageUploadSection}>
              {selectedImage ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: selectedImage}}
                    style={styles.uploadedImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={handleImageRemove}
                    activeOpacity={0.8}>
                    <View style={styles.removeImageIcon}>
                      <Text style={styles.removeImageText}>×</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleImageUpload}
                  activeOpacity={0.6}>
                  <PlusIcon width={24} height={24} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* 내용 입력 영역 */}
            <View style={styles.contentSection}>
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
                  scrollEnabled={true}
                />
              </View>
              <View style={styles.inputHelperContent}>
                <Text style={styles.characterCount}>{content.length}/500</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 등록 버튼 */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isSubmitEnabled || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isSubmitEnabled || isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>등록</Text>
          )}
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
    backgroundColor: '#FFFFFF',
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
  imageContentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  imageUploadSection: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 133,
    height: 133,
    borderRadius: 8,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 10,
  },
  removeImageIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 14,
    fontFamily: 'Pretendard-Bold',
    fontWeight: '700',
  },
  addImageButton: {
    width: 133,
    height: 133,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  contentSection: {
    flex: 1,
  },
  keywordSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titleInputContainer: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  titleInput: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    padding: 0,
  },
  contentInputContainer: {
    minHeight: 170,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  contentInput: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    padding: 0,
    textAlignVertical: 'top',
    minHeight: 170,
  },
  inputHelperTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },

  inputHelperContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
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
    marginTop: 12,
  },
  keywordButton: {
    backgroundColor: '#F2F2F2',
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
