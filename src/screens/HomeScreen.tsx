import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text as CustomText} from '../components/common/Text';

const {width: screenWidth} = Dimensions.get('window');


export default function HomeScreen() {
  return (
    
    <SafeAreaView style={styles.container} edges={['left', 'right']}>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 사용자 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <CustomText variant="bodyM" color="#555555">
              Lv. 5
            </CustomText>
            <CustomText variant="headlineS" color="#111111" weight="bold">
              {' '}김해린 님
            </CustomText>
          </View>
          
          <View style={styles.statsContainer}>
            {/* 교환한 옷 */}
            <View style={styles.statItem}>
              {/* 아이콘 추가  style={styles.statIcon}*/}
              <CustomText variant="bodyS" color="#888888" align="center">
                교환한 옷
              </CustomText>
              <CustomText variant="headlineL" color="#333333" weight="bold" align="center">
                23
              </CustomText>
            </View>

            {/* 크레딧 */}
            <View style={styles.statItem}>
              {/* 아이콘 추가  style={styles.statIcon}*/}
              <CustomText variant="bodyS" color="#888888" align="center">
                크레딧
              </CustomText>
              <CustomText variant="headlineL" color="#333333" weight="bold" align="center">
                1,250
              </CustomText>
            </View>

            {/* 교환 티켓 */}
            <View style={styles.statItem}>
              {/* <TicketIcon width={36} height={36} style={styles.statIcon} /> */}
              <CustomText variant="bodyS" color="#888888" align="center">
                교환 티켓
              </CustomText>
              <CustomText variant="headlineL" color="#333333" weight="bold" align="center">
                5
              </CustomText>
            </View>
          </View>

          {/* 내 옷 키우러 가기 버튼 */}
          <TouchableOpacity style={styles.growButton}>
            <CustomText variant="labelM" color="#FFFFFF" weight="bold" align="center">
              내 옷 키우러 가기 🌱
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* 응원하기 배너 */}
        <View style={styles.supportBanner}>
          <View style={styles.supportContent}>
            <View style={styles.supportIcons}>
              {/* 아이콘 추가  style={styles.supportIcon}*/}
            </View>
            <CustomText variant="headlineM" color="#FFFFFF" style={styles.supportText}>
              당신의 마음을 입히세요
            </CustomText>
            <TouchableOpacity style={styles.supportButton}>
              <CustomText variant="labelM" color="#E27931" weight="semiBold" align="center">
                응원하기
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 진행 중인 이벤트 */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsHeader}>
            <CustomText variant="headlineM" color="#1F2937">
              진행 중인 이벤트
            </CustomText>
            <CustomText variant="bodyM" color="#6B7280">
              3/5
            </CustomText>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.eventsScrollView}
            contentContainerStyle={styles.eventsContainer}
          >
            {/* 이벤트 카드 1 */}
            <View style={styles.eventCard}>
              <View style={styles.eventImage}>
                <CustomText variant="bodyM" color="#FFFFFF" align="center">
                  이미지 1
                </CustomText>
              </View>
              <View style={styles.eventContent}>
                <CustomText variant="headlineS" color="#1F2937">
                  👕아름다운X수선혁명랩(Lab)
                </CustomText>
                <CustomText variant="bodyM" color="#4B5563">
                  '교환'과 '수선'으로 끝까지 입는 경험과 실천을 제공하는 지속 가능한 의생활 실험 공간
                </CustomText>
              </View>
            </View>

            {/* 이벤트 카드 2 */}
            <View style={styles.eventCard}>
              <View style={styles.eventImage}>
                <CustomText variant="bodyM" color="#FFFFFF" align="center">
                  이미지 2
                </CustomText>
              </View>
              <View style={styles.eventContent}>
                <CustomText variant="headlineS" color="#1F2937">
                  업사이클링 워크샵
                </CustomText>
                <CustomText variant="bodyM" color="#4B5563">
                  헌 옷을 새롭게 변신시켜보세요
                </CustomText>
              </View>
            </View>

            {/* 이벤트 카드 3 */}
            <View style={styles.eventCard}>
              <View style={styles.eventImage}>
                <CustomText variant="bodyM" color="#FFFFFF" align="center">
                  이미지 3
                </CustomText>
              </View>
              <View style={styles.eventContent}>
                <CustomText variant="headlineS" color="#1F2937">
                  에코 패션 챌린지
                </CustomText>
                <CustomText variant="bodyM" color="#4B5563">
                  30일간 지속가능한 패션 실천하기
                </CustomText>
                <View style={styles.challengeContainer}>
                  <View style={styles.progressBadge}>
                    <CustomText variant="bodyS" color="#059669">
                      진행중
                    </CustomText>
                  </View>
                  <TouchableOpacity style={styles.challengeButton}>
                    <CustomText variant="bodyM" color="#059669" align="center">
                      도전하기
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* 페이지 인디케이터 */}
        <View style={styles.pageIndicator}>
          <View style={[styles.dot, styles.inactiveDot]} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={[styles.dot, styles.inactiveDot]} />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  growButton: {
    backgroundColor: '#06B0B7',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportBanner: {
    backgroundColor: '#E27931',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
  },
  supportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  supportIcons: {
    flexDirection: 'row',
    marginRight: 16,
  },
  supportIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  supportText: {
    flex: 1,
    marginRight: 16,
  },
  supportButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  eventsSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsScrollView: {
    marginBottom: 16,
  },
  eventsContainer: {
    paddingRight: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    width: 288,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    height: 128,
    backgroundColor: '#E5E7EB',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    padding: 16,
  },
  challengeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeButton: {
    paddingHorizontal: 8,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  dot: {
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
