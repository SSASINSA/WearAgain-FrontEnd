import React, {useRef, useEffect, useCallback, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Text as CustomText} from '../../../components/common/Text';
import SmsIcon from '../../../assets/icons/sms.svg';
import VolunteerIcon from '../../../assets/icons/volunteerIcon.svg';
import {useBannerStore} from '../../../store/banner.store';

interface Banner {
  id: number;
  title: string;
  buttonText: string;
  backgroundColor: string;
  icon: 'sms' | 'volunteer';
  link?: string;
}

interface BannerCarouselProps {
  banners?: Banner[];
  autoSwipeInterval?: number;
  userInteractionDelay?: number;
}

const AUTO_SWIPE_INTERVAL = 2500;
const USER_INTERACTION_DELAY = 2000;
const INFINITE_BANNERS_REPEAT_COUNT = 100;

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 1,
    title: '환경 뉴스레터',
    buttonText: '보러가기',
    backgroundColor: '#642C8D',
    icon: 'sms' as const,
    link: 'https://page.stibee.com/archives/69943',
  },
  {
    id: 2,
    title: '당신의 마음을 입히세요',
    buttonText: '응원하기',
    backgroundColor: '#E27931',
    icon: 'volunteer' as const,
    link: 'https://box.donus.org/box/wearagain/saveclothes?_ga=2.168483685.557985844.1678075479-710762688.1676980328',
  },
];

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners = DEFAULT_BANNERS,
  autoSwipeInterval = AUTO_SWIPE_INTERVAL,
  userInteractionDelay = USER_INTERACTION_DELAY,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const autoSwipeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // containerWidth는 bannerContainer의 실제 너비 (이미 marginHorizontal이 적용된 후)
  const bannerWidth = containerWidth;
  const itemWidth = bannerWidth > 0 ? bannerWidth + 16 : 0; // 배너 너비 + 오른쪽 마진
  
  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [containerWidth]);

  const {
    currentScrollIndex,
    isUserInteracting,
    setCurrentScrollIndex,
    setIsUserInteracting,
  } = useBannerStore();
  
  const getBannerState = useBannerStore.getState;

  const infiniteBanners = useMemo(() => {
    const repeatedBanners: Banner[] = [];
    for (let i = 0; i < INFINITE_BANNERS_REPEAT_COUNT; i++) {
      repeatedBanners.push(...banners);
    }
    return repeatedBanners;
  }, [banners]);

  const [indicatorIndex, setIndicatorIndex] = useState(() => {
    if (banners.length === 0) return 0;
    return currentScrollIndex % banners.length;
  });

  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (!isInitializedRef.current) {
      const initialScrollX = currentScrollIndex * itemWidth;
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: initialScrollX,
          animated: false,
        });
        isInitializedRef.current = true;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentScrollIndex, itemWidth]);

  const startAutoSwipe = useCallback(() => {
    if (autoSwipeTimerRef.current) {
      clearInterval(autoSwipeTimerRef.current);
    }

    autoSwipeTimerRef.current = setInterval(() => {
      const state = getBannerState();
      
      if (!state.isUserInteracting && flatListRef.current) {
        const nextIndex = state.currentScrollIndex + 1;
        const nextScrollX = nextIndex * itemWidth;
        const nextBannerIndex = banners.length > 0 ? nextIndex % banners.length : 0;

        setCurrentScrollIndex(nextIndex);
        setIndicatorIndex(nextBannerIndex);

        flatListRef.current.scrollToOffset({
          offset: nextScrollX,
          animated: true,
        });
      }
    }, autoSwipeInterval);
  }, [itemWidth, autoSwipeInterval, banners.length, setCurrentScrollIndex, getBannerState]);

  const stopAutoSwipe = useCallback(() => {
    if (autoSwipeTimerRef.current) {
      clearInterval(autoSwipeTimerRef.current);
      autoSwipeTimerRef.current = null;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsUserInteracting(false);
      
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }

      resumeTimerRef.current = setTimeout(() => {
        startAutoSwipe();
      }, USER_INTERACTION_DELAY);

      return () => {
        stopAutoSwipe();
        if (resumeTimerRef.current) {
          clearTimeout(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
      };
    }, [startAutoSwipe, stopAutoSwipe, USER_INTERACTION_DELAY, setIsUserInteracting])
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollX = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollX / itemWidth);
      
      if (index !== currentScrollIndex) {
        setCurrentScrollIndex(index);
      }
    },
    [itemWidth, currentScrollIndex, setCurrentScrollIndex]
  );

  const handleScrollBeginDrag = useCallback(() => {
    setIsUserInteracting(true);
    stopAutoSwipe();
  }, [setIsUserInteracting, stopAutoSwipe]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollX = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollX / itemWidth);
      const bannerIndex = banners.length > 0 ? index % banners.length : 0;
      
      setCurrentScrollIndex(index);
      setIndicatorIndex(bannerIndex);
      
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }

      resumeTimerRef.current = setTimeout(() => {
        setIsUserInteracting(false);
        startAutoSwipe();
      }, userInteractionDelay);
    },
    [
      itemWidth,
      banners.length,
      setCurrentScrollIndex,
      setIsUserInteracting,
      startAutoSwipe,
      userInteractionDelay,
    ]
  );

  const renderBannerIcon = (icon: string) => {
    switch (icon) {
      case 'sms':
        return <SmsIcon width={20} height={20} style={styles.bannerIcon} />;
      case 'volunteer':
        return <VolunteerIcon width={20} height={20} style={styles.bannerIcon} />;
      default:
        return null;
    }
  };

  const handleBannerPress = async (link?: string) => {
    if (!link) {
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(link);
      if (canOpen) {
        await Linking.openURL(link);
      } else {
        Alert.alert('오류', '링크를 열 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '링크를 열 수 없습니다.');
    }
  };

  const renderBannerItem = useCallback(
    ({item, index}: {item: Banner; index: number}) => {
      return (
        <View
          style={[
            styles.bannerItem,
            {
              backgroundColor: item.backgroundColor,
              width: bannerWidth,
              marginRight: 16,
            },
          ]}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIcon}>
              {renderBannerIcon(item.icon)}
            </View>
            <CustomText
              variant="headlineM"
              color="#FFFFFF"
              style={styles.bannerText}>
              {item.title}
            </CustomText>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => handleBannerPress(item.link)}
              activeOpacity={0.8}>
              <CustomText
                variant="labelM"
                color={item.backgroundColor}
                weight="semiBold"
                align="center">
                {item.buttonText}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [bannerWidth]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth]
  );

  const keyExtractor = useCallback(
    (_: Banner, index: number) => `banner-${index}`,
    []
  );

  return (
    <View 
      style={styles.bannerContainer}
      onLayout={handleContainerLayout}>
      {containerWidth > 0 && (
        <>
          <FlatList
            ref={flatListRef}
            data={infiniteBanners}
            renderItem={renderBannerItem}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={itemWidth}
            snapToAlignment="start"
            decelerationRate="fast"
            getItemLayout={getItemLayout}
            onScroll={handleScroll}
            onScrollBeginDrag={handleScrollBeginDrag}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            windowSize={5}
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            updateCellsBatchingPeriod={50}
            initialNumToRender={3}
          />

          <BannerIndicator
            banners={banners}
            activeIndex={indicatorIndex}
          />
        </>
      )}
    </View>
  );
};

interface BannerIndicatorProps {
  banners: Banner[];
  activeIndex: number;
}

const BannerIndicator = React.memo<BannerIndicatorProps>(
  ({banners, activeIndex}) => {
    return (
      <View style={styles.bannerIndicator}>
        {banners.map((banner, index) => (
          <View
            key={banner.id}
            style={[
              styles.indicatorDot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  }
);

BannerIndicator.displayName = 'BannerIndicator';

const styles = StyleSheet.create({
  bannerContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    height: 'auto',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bannerItem: {
    borderRadius: 3,
    padding: 16,
    height: 62,
    flex: 1,
    justifyContent: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  bannerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  bannerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 10,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 88,
    flexDirection: 'row',
  },
  bannerIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6B7280',
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
  },
});
