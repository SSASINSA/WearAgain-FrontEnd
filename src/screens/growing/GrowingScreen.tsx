import React from 'react';
import {apiClient} from '../../api/client';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from '../../components/common/Text';
import DetailHeader from '../../components/common/DetailHeader';
import RankingIcon from '../../assets/icons/ranking.svg';
import ScissorsIcon from '../../assets/icons/scissors.svg';

const imgShadow = require('../../assets/images/growing/shadow.png');

// API 응답 타입 정의
interface MascotStatus {
  level: number;
  exp: number;
  nextLevelExp: number;
  magicScissorCount: number;
  cycles: number;
}

interface ImpactStatus {
  co2Saved: number;
  waterSaved: number;
  energySaved: number;
}

interface RewardStatus {
  rewardGranted: boolean;
  credit: number;
}

// 초기 상태 조회 응답
interface GrowthStatusResponse {
  mascot: MascotStatus;
  impact: ImpactStatus;
}

// 가위 사용 API 응답
interface MagicScissorsUseResponse {
  mascot: MascotStatus;
  reward: RewardStatus;
}

const {width: screenWidth} = Dimensions.get('window');

// 이미지 상수들 (Figma에서 제공된 이미지들) - 변경 필요
const characterImages = {
  idle: require('../../assets/images/growing/weary_idle.png'),
  happy: require('../../assets/images/growing/weary_happy.png'),
  sad: require('../../assets/images/growing/weary_sad.png'),
  tired: require('../../assets/images/growing/weary_tired.png'),
  curious: require('../../assets/images/growing/weary_curious.png'),
};
const characterKeys = ['idle', 'sad', 'tired', 'curious'];

// 캐릭터 상태별 대사
const characterDialogues = {
  idle: '안녕! 오늘 뭔가 재미있는 일이 있을까?\n 나랑 얘기하자~',
  happy: '오오! 수선이 정말 잘 됐어!\n고마워!',
  sad: '다른 옷이 버려지는 것을 봐버렸어.\n너무 슬퍼. ㅠ.ㅠ',
  tired: '정말 힘든 요즘이야.\n그래도 이겨낼 수 있을 거야.',
  curious: '내가 환경을 위해서\n할 수 있는 일이 더 없을까?',
};

const imgCo2Icon = require('../../assets/icons/co2.png');
const imgWaterIcon = require('../../assets/icons/water_drop.png');
const imgEnergyIcon = require('../../assets/icons/energy.png');
const imgEllipse1 = 'http://localhost:3845/assets/a0e9a6afb2be9a36ddb0883ba49c5206fe2479a4.svg';

export default function GrowingScreen() {
  const navigation = useNavigation();
  const [currentCharacter, setCurrentCharacter] = React.useState('idle');
  const [currentLevel, setCurrentLevel] = React.useState(1);
  const [currentExp, setCurrentExp] = React.useState(0);
  const [nextLevelExp, setNextLevelExp] = React.useState(100);
  const [currentRepairs, setCurrentRepairs] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [co2Saved, setCo2Saved] = React.useState(0);
  const [waterSaved, setWaterSaved] = React.useState(0);
  const [energySaved, setEnergySaved] = React.useState(0);
  
  const scissorsAnimX = React.useRef(new Animated.Value(0)).current;
  const scissorsAnimY = React.useRef(new Animated.Value(0)).current;
  const scissorsOpacity = React.useRef(new Animated.Value(0)).current;
  const scissorsRotate = React.useRef(new Animated.Value(0)).current;
  const scissorsScale = React.useRef(new Animated.Value(0.6)).current;
  const hoverAnim = React.useRef(new Animated.Value(0)).current;
  const progressAnimValue = React.useRef(new Animated.Value(0)).current;
  const [showLevelUpModal, setShowLevelUpModal] = React.useState(false);
  const [levelUpReward, setLevelUpReward] = React.useState({ level: 0, credit: 0 });
  
  // Debouncing을 위한 누적 사용 개수 및 타이머
  const pendingUseCount = React.useRef(0);
  const debouncedApiCallTimeout = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    } as any);
  }, [navigation]);

  // 초기 데이터 로드
  React.useEffect(() => {
    const loadGrowthStatus = async () => {
      try {
        const response = await apiClient.get<GrowthStatusResponse>('/growth/status');
        const data = response.data;
        
        // mascot 데이터 확인
        if (data?.mascot) {
          setCurrentLevel(data.mascot.level ?? 1);
          setCurrentExp(data.mascot.exp ?? 0);
          setNextLevelExp(data.mascot.nextLevelExp ?? 100);
          setCurrentRepairs(data.mascot.magicScissorCount ?? 0);
          
          // progressBar 초기값 설정
          progressAnimValue.setValue(data.mascot.exp ?? 0);
        }
        
        // impact 데이터 확인
        if (data?.impact) {
          setCo2Saved(data.impact.co2Saved ?? 0);
          setWaterSaved(data.impact.waterSaved ?? 0);
          setEnergySaved(data.impact.energySaved ?? 0);
        }
      } catch (error) {
        console.error('성장 상태 조회 실패:', error);
        Alert.alert('오류', '성장 상태를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGrowthStatus();
  }, [progressAnimValue]);

  // 호버 애니메이션 (위아래로 약간씩 반복 이동)
  React.useEffect(() => {
    if (isAnimating) {
      hoverAnim.setValue(0); // 수선 중일 때 애니메이션 멈춤
      return;
    }

    // 무한 반복 호버 애니메이션
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(hoverAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(hoverAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isAnimating, hoverAnim]);

  // 현재 표정과 다른 표정으로 랜덤 선택
  const getRandomDifferentCharacter = () => {
    const availableCharacters = characterKeys.filter(key => key !== currentCharacter);
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    return availableCharacters[randomIndex];
  };

  const handleCharacterPress = () => {
    const newCharacter = getRandomDifferentCharacter();
    setCurrentCharacter(newCharacter);
  };

  // 가위 애니메이션 함수 - 부드러운 대각선 스윕 3번
const playScissorsAnimation = (onComplete?: () => void) => {
  // 초기화
  scissorsAnimX.setValue(0);
  scissorsAnimY.setValue(0);
  scissorsOpacity.setValue(0);
  scissorsRotate.setValue(0);
  scissorsScale.setValue(0.6);

  Animated.sequence([
    // 1. 나타나면서 스프링 스케일
    Animated.parallel([
      Animated.timing(scissorsOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scissorsScale, {
        toValue: 1,
        speed: 24,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]),

    // 2. 대각선으로 편도 이동 (회전 포함)
    Animated.parallel([
      Animated.timing(scissorsAnimX, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scissorsAnimY, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scissorsRotate, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]),

    // 3. 살짝 줄어들면서 페이드아웃
    Animated.parallel([
      Animated.timing(scissorsOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(scissorsScale, {
        toValue: 0.8,
        duration: 180,
        useNativeDriver: true,
      }),
    ]),
  ]).start(onComplete);
};

  // 누적된 사용 개수로 API 호출
  const executeRepairApi = async (useCount: number) => {
    if (useCount <= 0) return;

    setIsAnimating(true);
    
    try {
      // 1. 서버에 가위 사용 요청 (누적 개수 전송)
      const response = await apiClient.post<MagicScissorsUseResponse>('/growth/magic-scissors/use', {
        useCount: useCount,
      });
      const updatedData = response.data;
      
      // 2. 서버에서 받은 데이터로 상태 업데이트
      const newLevel = updatedData.mascot.level;
      const newExp = updatedData.mascot.exp;
      const newRepairs = updatedData.mascot.magicScissorCount;
      const isLeveledUp = updatedData.reward.rewardGranted; // reward.rewardGranted로 레벨업 판정
      
      // 3. progressBar 애니메이션 시작
      if (isLeveledUp) {
        // 레벨업이 있는 경우: nextLevelExp까지 올라갔다가 새 EXP로 리셋
        Animated.sequence([
          // 1단계: nextLevelExp까지 올라가기 (현재 nextLevelExp 값 기준)
          Animated.timing(progressAnimValue, {
            toValue: nextLevelExp,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
          // 2단계: 리셋 (즉시)
          Animated.timing(progressAnimValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
          // 3단계: 새 EXP까지 차오르기
          Animated.timing(progressAnimValue, {
            toValue: newExp,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
        ]).start();
      } else {
        // 레벨업이 없는 경우: 단순히 새 EXP까지 올라가기
        Animated.timing(progressAnimValue, {
          toValue: newExp,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }

      // 레벨업 정보 캡처 (콜백에서 사용하기 위해)
      const rewardCredit = updatedData.reward.credit;

      setCurrentExp(newExp);
      setCurrentLevel(newLevel);
      setCurrentRepairs(newRepairs);
      setNextLevelExp(updatedData.mascot.nextLevelExp ?? nextLevelExp);
      
      // 표정을 happy로 변경
      setCurrentCharacter('happy');
      
      // 가위 애니메이션 재생 (완료 후 idle로 복귀)
      playScissorsAnimation(() => {
        setIsAnimating(false);
        // 애니메이션 완료 후 500ms 후 idle로 복귀
        setTimeout(() => {
          setCurrentCharacter('idle');
          
          // 레벨업 여부에 따라 팝업 표시
          if (isLeveledUp) {
            setLevelUpReward({ level: newLevel, credit: rewardCredit });
            setShowLevelUpModal(true);
          }
        }, 500);
      });
    } catch (error) {
      console.error('수선 실패:', error);
      Alert.alert('오류', '수선에 실패했습니다.');
      setIsAnimating(false);
    }
  };

  // 즉시 실행되는 수선 버튼 핸들러 (debouncing 포함)
  const handleRepairPress = () => {
    if (isAnimating || currentRepairs <= 0) return;

    // 1. 사용 개수 누적
    pendingUseCount.current += 1;

    // 2. 기존 타이머 취소
    if (debouncedApiCallTimeout.current) {
      clearTimeout(debouncedApiCallTimeout.current);
    }

    // 3. 새 타이머 설정 (500ms 후 API 호출)
    debouncedApiCallTimeout.current = setTimeout(() => {
      const useCount = pendingUseCount.current;
      pendingUseCount.current = 0; // 리셋
      
      // API 호출
      executeRepairApi(useCount);
    }, 500);
  };

  const handleRankingPress = () => {
    (navigation as any).navigate('Ranking');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#FAF5FF', '#ECFEFF']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.container}
      >
        <DetailHeader useTopInset={false} title="옷 키우기"/>
        <View style={styles.contentContainer}>
          {/* 상단 콘텐츠 영역 */}
          <View style={styles.topContent}>
            {/* 환경 통계 카드 */}
            <View style={[styles.statsCard]}>
              <View style={styles.statsContent}>
                {/* CO2 절감 */}
                <View style={styles.statItem}>
                  <Image source={imgCo2Icon} style={styles.statIcon} />
                  <Text variant="bodyS" color="#888888" align="center" style={styles.statLabel}>
                    CO2 절감
                  </Text>
                  <Text variant="headlineM" color="#333333" align="center" weight="bold" style={styles.statValue}>
                    {co2Saved}kg
                  </Text>
                </View>

                {/* 물 절감 */}
                <View style={styles.statItem}>
                  <Image source={imgWaterIcon} style={styles.statIcon} />
                  <Text variant="bodyS" color="#888888" align="center" style={styles.statLabel}>
                    물 절감
                  </Text>
                  <Text variant="headlineM" color="#333333" align="center" weight="bold" style={styles.statValue}>
                    {waterSaved}L
                  </Text>
                </View>

                {/* 에너지 절감 */}
                <View style={styles.statItem}>
                  <Image source={imgEnergyIcon} style={styles.statIcon} />
                  <Text variant="bodyS" color="#888888" align="center" style={styles.statLabel}>
                    에너지 절감
                  </Text>
                  <Text variant="headlineM" color="#333333" align="center" weight="bold" style={styles.statValue}>
                    {energySaved}KWh
                  </Text>
                </View>
              </View>
            </View>

            {/* 캐릭터 대화 영역 */}
            <View style={styles.dialogueCard}>
              <Text variant="bodyL" color="#374151" align="center" style={styles.dialogueText}>
                {characterDialogues[currentCharacter as keyof typeof characterDialogues]}
              </Text>
            </View>

            {/* 캐릭터 영역 */}
            <TouchableOpacity 
              onPress={handleCharacterPress} 
              style={styles.characterSection}
              activeOpacity={1}
            >

              {/* 캐릭터 이미지 */}
              <Animated.View
                style={[
                  styles.characterImageContainer,
                  {
                    transform: [
                      {
                        translateY: hoverAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -8],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image source={characterImages[currentCharacter as keyof typeof characterImages]} style={styles.characterImage} />
                
                {/* 애니메이션 가위 */}
                <Animated.View
                  style={[
                    styles.animatedScissors,
                    {
                      opacity: scissorsOpacity,
                      transform: [
                        // 0. 등장/퇴장 스케일
                        { scale: scissorsScale },

                        // 1. 회전 애니메이션
                        {
                          rotate: scissorsRotate.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                          }),
                        },

                        // 2. X축: 대각선 편도 이동 (왼쪽 위에서 오른쪽 아래로, 한 번만)
                        {
                          translateX: scissorsAnimX.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-80, 80],
                          }),
                        },

                        // 3. Y축: X랑 반대로 대각선 편도 이동
                        {
                          translateY: scissorsAnimY.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-80, 80],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.scissorsWrapper}>
                    <ScissorsIcon width={36} height={36} color="#8a3fb8" />
                  </View>
                </Animated.View>
              </Animated.View>

              {/* 캐릭터 그림자 */}
              <Animated.View
                style={[
                  styles.shadowContainer,
                  {
                    transform: [
                      {
                        scaleX: hoverAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.88, 0.78],
                        }),
                      },
                      {
                        scaleY: hoverAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.88, 0.78],
                        }),
                      },
                    ],
                    opacity: hoverAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 0.45],
                    }),
                  },
                ]}
              >
                <Image source={imgShadow} style={styles.shadowImage} />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* 하단 버튼 영역 */}
          <View style={styles.bottomSection}>
            {/* 랭킹 버튼 */}
            <View style={styles.actionButtons}>
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity onPress={handleRankingPress} style={styles.actionButton}>
                  <RankingIcon width={27} height={27} color="#FFFFFF" />
                </TouchableOpacity>
                <Text variant="bodyM" color="#374151" align="center" style={styles.actionButtonLabel}>
                  랭킹
                </Text>
              </View>
            </View>

            {/* 레벨 진행률 바 */}
            <View style={styles.levelCard}>
              <View style={styles.levelContent}>
                <View style={styles.levelTopContainer}>
                  {/* 레벨 배지 */}
                  <LinearGradient
                    colors={['#06b0b7', '#08d4dc']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.levelBadge}
                  >
                    <Text variant="bodyL" color="#FFFFFF" weight="bold">Lv.{currentLevel}</Text>
                  </LinearGradient>

                  <View style={styles.levelTextContainer}>
                    <Text variant="bodyM" color="#6B7280">다음 레벨까지</Text>
                    <Text variant="bodyM" color="#06b0b7">{currentExp}/{nextLevelExp} EXP</Text>
                  </View>
                </View>
                
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <Animated.View
                        style={[
                          styles.progressBarFill,
                          {
                            width: progressAnimValue.interpolate({
                              inputRange: [0, nextLevelExp],
                              outputRange: ['0%', '100%'],
                            }),
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={['#06b0b7', '#08d4dc']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </Animated.View>
                    </View>
                  </View>
                </View>

                {/* 수선하기 버튼 */}
                <TouchableOpacity 
                  onPress={handleRepairPress} 
                  style={styles.repairButton}
                  disabled={isAnimating || currentRepairs <= 0}
                >
                  <LinearGradient
                colors={isAnimating || currentRepairs <= 0 ? ['#CCCCCC', '#CCCCCC'] : ['#8a3fb8', '#7E3AA8']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.repairButtonGradient}
              >
                <ScissorsIcon width={16} height={16} color="#FFFFFF" />
                <Text variant="bodyL" color="#FFFFFF" weight="bold">수선하기</Text>
                <Text variant="bodyL" color="#FFFFFF" weight="bold">{currentRepairs}</Text>
              </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* 레벨업 팝업 */}
      {showLevelUpModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="headlineL" color="#8a3fb8" weight="bold" align="center" style={styles.modalTitle}>
              레벨업을 축하합니다! 🎉
            </Text>
            
            <View style={styles.modalRewardContainer}>
              <View style={styles.rewardItem}>
                <Text variant="bodyM" color="#666666" align="center">
                  레벨업
                </Text>
                <Text variant="headlineL" color="#8a3fb8" weight="bold" align="center">
                  Lv.{levelUpReward.level}
                </Text>
              </View>
              
              <View style={styles.rewardDivider} />
              
              <View style={styles.rewardItem}>
                <Text variant="bodyM" color="#666666" align="center">
                  크레딧 리워드
                </Text>
                <Text variant="headlineL" color="#06b0b7" weight="bold" align="center">
                  +{levelUpReward.credit}C
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowLevelUpModal(false)}
            >
              <Text variant="bodyL" color="#FFFFFF" weight="bold" align="center">
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContent: {
    flex: 1,
  },
  bottomSection: {
    paddingBottom: 16,
  },
  statsCard: {
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 2,
    paddingVertical: 20,
    borderWidth: 4,
    borderColor: '#D5F5D0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#3C543C',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
    minHeight: 120,
    maxHeight: 140,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  statLabel: {
    marginBottom: 2,
  },
  statValue: {
    marginTop: 2,
  },
  dialogueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 20,
    paddingHorizontal: 17,
  },
  dialogueText: {
    lineHeight: 24,
  },
  characterSection: {
    alignItems: 'center',
    marginTop: 12,
    position: 'relative',
  },
  arrowContainer: {
    marginBottom: 8,
    transform: [{rotate: '180deg'}],
  },
  arrowIcon: {
    width: 30,
    height: 30,
  },
  characterImageContainer: {
    width: 176,
    height: 168,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  animatedScissors: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
    //borderRadius: 32,
    //borderWidth: 2,
    //borderColor: '#8a3fb8',
    //backgroundColor: 'rgba(138, 63, 184, 0.1)',
  },
  scissorsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowContainer: {
    marginTop: -26,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowImage: {
    width: 120,
    height: 72,
    resizeMode: 'contain',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 12,
  },
  modalTitle: {
    marginBottom: 24,
  },
  modalRewardContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  rewardItem: {
    flex: 1,
    alignItems: 'center',
  },
  rewardDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#8a3fb8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterNameContainer: {
    width: 176,
    height: 32,
  },
  characterNameBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  actionButtons: {
    alignItems: 'flex-end',
    marginRight: 24,
    marginBottom: 8,
  },
  actionButtonContainer: {
    alignItems: 'center',
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#06b0b7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  actionButtonLabel: {
    fontSize: 12,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    position: 'relative',
    overflow: 'visible',
  },
  levelContent: {
    position: 'relative',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  levelTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  levelTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  progressBarWrapper: {
    position: 'relative',
    paddingTop: 0,
    marginBottom: 4,
  },
  progressBarContainer: {
    marginTop: 12,
    marginBottom: 2,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repairButton: {
    marginTop: 8,
    width: '100%',
  },
  repairButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  repairIcon: {
    width: 16,
    height: 16,
  },
});
