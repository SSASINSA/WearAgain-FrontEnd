import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Text as CustomText } from '../../../components/common/Text';
import SmsIcon from '../../../assets/icons/sms.svg';
import VolunteerIcon from '../../../assets/icons/volunteerIcon.svg';

interface Banner {
  id: number;
  title: string;
  buttonText: string;
  backgroundColor: string;
  icon: 'sms' | 'volunteer';
}

interface BannerCarouselProps {
  banners: Banner[];
  autoSwipeInterval?: number;
  userInteractionDelay?: number;
}

const AUTO_SWIPE_INTERVAL = 3000;
const USER_INTERACTION_DELAY = 3000;
const INFINITE_BANNERS_REPEAT_COUNT = 100;

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ 
  banners, 
  autoSwipeInterval = AUTO_SWIPE_INTERVAL,
  userInteractionDelay = USER_INTERACTION_DELAY 
}) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width - 32;

  const createInfiniteBanners = (): Banner[] => {
    const repeatedBanners: Banner[] = [];
    for (let i = 0; i < INFINITE_BANNERS_REPEAT_COUNT; i++) {
      repeatedBanners.push(...banners);
    }
    return repeatedBanners;
  };

  const infiniteBanners = createInfiniteBanners();
  const startIndex = Math.floor(infiniteBanners.length / 2);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(startIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        const initialScrollX = startIndex * (screenWidth + 16);
        scrollViewRef.current.scrollTo({
          x: initialScrollX,
          animated: false,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isUserInteracting && scrollViewRef.current) {
        setCurrentBannerIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length;
          return nextIndex;
        });
        
        setCurrentScrollIndex((prevScrollIndex) => {
          const nextScrollIndex = prevScrollIndex + 1;
          const nextScrollX = nextScrollIndex * (screenWidth + 16);
          
          scrollViewRef.current?.scrollTo({
            x: nextScrollX,
            animated: true,
          });
          
          return nextScrollIndex;
        });
      }
    }, autoSwipeInterval);

    return () => clearInterval(interval);
  }, [screenWidth, banners.length, isUserInteracting, autoSwipeInterval]);

  const renderBannerIcon = (icon: string) => {
    switch (icon) {
      case 'sms':
        return <SmsIcon width={20} height={20} style={styles.newsletterIcons} />;
      case 'volunteer':
        return <VolunteerIcon width={20} height={20} style={styles.newsletterIcons} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.bannerContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.swiper}
        contentOffset={{ x: startIndex * (screenWidth + 16), y: 0 }}
        snapToInterval={screenWidth + 16}
        snapToAlignment="start"
        decelerationRate="fast"
        onScrollBeginDrag={() => {
          setIsUserInteracting(true);
        }}
        onMomentumScrollEnd={(event) => {
          const scrollX = event.nativeEvent.contentOffset.x;
          const index = Math.round(scrollX / (screenWidth + 16));
          const actualIndex = index % banners.length;
          
          setCurrentBannerIndex(actualIndex);
          setCurrentScrollIndex(index);
          
          setTimeout(() => {
            setIsUserInteracting(false);
          }, userInteractionDelay);
        }}
        scrollEventThrottle={16}
      >
        {infiniteBanners.map((banner, index) => (
          <View 
            key={`${banner.id}-${index}`}
            style={[
              styles.newsletterBanner, 
              {
                backgroundColor: banner.backgroundColor,
                width: screenWidth,
                marginRight: 16,
              }
            ]}
          >
            <View style={styles.newsletterContent}>
              <View style={styles.newsletterIcons}>
                {renderBannerIcon(banner.icon)}
              </View>
              <CustomText variant="headlineM" color="#FFFFFF" style={styles.newsletterText}>
                {banner.title}
              </CustomText>
              <TouchableOpacity style={styles.newsletterButton}>
                <CustomText variant="labelM" color={banner.backgroundColor} weight="semiBold" align="center">
                  {banner.buttonText}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 배너 인디케이터 */}
      <View style={styles.bannerIndicator}>
        {banners.map((_, index) => (
          <View 
            key={index}
            style={[
              styles.indicatorDot, 
              currentBannerIndex === index ? styles.activeDot : styles.inactiveDot
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    height: 'auto',
    borderRadius: 3,
    overflow: 'hidden',
  },
  swiper: {
    height: 62,
  },
  newsletterBanner: {
    borderRadius: 3,
    padding: 16,
    height: 62,
    flex: 1,
    justifyContent: 'center',
  },
  newsletterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  newsletterIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  newsletterText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 10,
  },
  newsletterButton: {
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
