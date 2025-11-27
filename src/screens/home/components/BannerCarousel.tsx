import React, {useRef, useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  LayoutChangeEvent,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useFocusEffect} from '@react-navigation/native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {Text as CustomText} from '../../../components/common/Text';
import SmsIcon from '../../../assets/icons/sms.svg';
import VolunteerIcon from '../../../assets/icons/volunteerIcon.svg';
import {useBannerStore} from '../../../store/banner.store';

function ChevronRightIcon() {
  return (
    <Svg width={9} height={14} viewBox="0 0 9 14" fill="none">
      <Path
        d="M1 1.5 7 7l-6 5.5"
        stroke="#FFFFFF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
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
  const carouselRef = useRef<ICarouselInstance>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);

  const {
    isUserInteracting,
    setIsUserInteracting,
  } = useBannerStore();

  const bannerWidth = containerWidth;
  const itemWidth = bannerWidth + 16; // 배너 너비 + 간격

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [containerWidth]);

  useFocusEffect(
    useCallback(() => {
      setIsUserInteracting(false);
      setIsAutoPlayEnabled(true);

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }

      return () => {
        if (resumeTimerRef.current) {
          clearTimeout(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
      };
    }, [setIsUserInteracting])
  );

  const handleSnapToItem = useCallback((index: number) => {
    setActiveIndex(index);

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      setIsAutoPlayEnabled(true);
    }, userInteractionDelay);
  }, [setIsUserInteracting, userInteractionDelay]);

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

  const handleBannerPress = useCallback(async (link?: string) => {
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
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsUserInteracting(true);
    setIsAutoPlayEnabled(false);

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
  }, [setIsUserInteracting]);

  const handleTouchEnd = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      setIsAutoPlayEnabled(true);
    }, userInteractionDelay);
  }, [setIsUserInteracting, userInteractionDelay]);

  const renderBannerItem = useCallback(
    ({item}: {item: Banner}) => {
      return (
        <TouchableOpacity
          style={[
            styles.bannerItem,
            {
              backgroundColor: item.backgroundColor,
              width: bannerWidth,
            },
          ]}
          onPress={() => handleBannerPress(item.link)}
          activeOpacity={0.8}>
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
            <ChevronRightIcon />
          </View>
        </TouchableOpacity>
      );
    },
    [bannerWidth, handleBannerPress]
  );

  return (
    <View 
      style={styles.bannerContainer}
      onLayout={handleContainerLayout}>
      {containerWidth > 0 && banners.length > 0 && (
        <>
          <View
            style={styles.carouselSection}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>
            <Carousel
              ref={carouselRef}
              data={banners}
              renderItem={renderBannerItem}
              width={itemWidth}
              pagingEnabled={true}
              height={62}
              loop={true}
              autoPlay={isAutoPlayEnabled && !isUserInteracting}
              autoPlayInterval={autoSwipeInterval}
              onSnapToItem={handleSnapToItem}
              scrollAnimationDuration={600}
              style={styles.carousel}
            />
          </View>

          <BannerIndicator
            banners={banners}
            activeIndex={activeIndex}
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
  },
  carouselSection: {
    height: 62,
    width: '100%',
  },
  carousel: {
    width: '100%',
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
