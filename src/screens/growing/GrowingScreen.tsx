import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from '../../components/common/Text';
import DetailHeader from '../../components/common/DetailHeader';
import RankingIcon from '../../assets/icons/ranking.svg';
import ScissorsIcon from '../../assets/icons/scissors.svg';

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
  idle: '"안녕! 오늘 뭔가 재미있는 일이 있을까?\n 나랑 얘기하자~"',
  happy: '"오오! 수선이 정말 잘되네!\n고마워!"',
  sad: '"다른 옷이 버려지는 것을 봐버렸어.\n너무 슬퍼. ㅠ.ㅠ"',
  tired: '"정말 힘든 요즘이야.\n그래도 이겨낼 수 있을 거야."',
  curious: '"내가 환경을 위해서\n할 수 있는 일이 더 없을까?"',
};

const imgCo2Icon = require('../../assets/icons/co2.png');
const imgWaterIcon = require('../../assets/icons/water_drop.png');
const imgEnergyIcon = require('../../assets/icons/energy.png');
const imgPolygon1 = 'http://localhost:3845/assets/50e5f50a7a47a98365899d337357dd1d1bd543cd.svg';
const imgFrame = 'http://localhost:3845/assets/52578f4e2fc4b3c22e2317defbc9cc3cd9e1b6bd.svg';
const imgDiv = 'http://localhost:3845/assets/06bf3123962fa4cb90ef2887e2273d8af2e9f15d.svg';
const imgEllipse1 = 'http://localhost:3845/assets/a0e9a6afb2be9a36ddb0883ba49c5206fe2479a4.svg';
const imgFrame1 = 'http://localhost:3845/assets/b0ef03a51c1a695fc2d0d8863ff11172d945bc8d.svg';

export default function GrowingScreen() {
  const navigation = useNavigation();
  const [currentCharacter, setCurrentCharacter] = React.useState('idle');
  const [currentLevel, setCurrentLevel] = React.useState(1);
  const [currentExp, setCurrentExp] = React.useState(0);
  const [currentRepairs, setCurrentRepairs] = React.useState(5);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const scissorsAnimX = React.useRef(new Animated.Value(0)).current;
  const scissorsAnimY = React.useRef(new Animated.Value(0)).current;
  const scissorsOpacity = React.useRef(new Animated.Value(0)).current;
  const scissorsRotate = React.useRef(new Animated.Value(0)).current;
  const scissorsScale = React.useRef(new Animated.Value(0.6)).current;
  const hoverAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    } as any);
  }, [navigation]);

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
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(hoverAnim, {
          toValue: 0,
          duration: 2000,
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
    // 1. 살짝 튕기면서 페이드인
    Animated.parallel([
      Animated.timing(scissorsOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(scissorsScale, {
        toValue: 1,
        friction: 6,
        tension: 140,
        useNativeDriver: true,
      }),
    ]),

    // 2. 대각선으로 부드럽게 3번 훑기 + 살짝 기울어진 상태 유지
    Animated.parallel([
      Animated.timing(scissorsAnimX, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scissorsAnimY, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scissorsRotate, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.sin),
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


  const handleRepairPress = () => {
    if (isAnimating || currentRepairs <= 0) return;

    setIsAnimating(true);
    
    // EXP 35 증가 및 레벨 업 로직
    let newExp = currentExp + 35;
    let newLevel = currentLevel;

    // 100 이상의 EXP가 있는 동안 레벨 업
    while (newExp >= 100) {
      newLevel += 1;
      newExp -= 100;
    }

    setCurrentExp(newExp);
    setCurrentLevel(newLevel);
    setCurrentRepairs(currentRepairs - 1);
    
    // 표정을 happy로 변경
    setCurrentCharacter('happy');
    
    // 가위 애니메이션 재생 (완료 후 idle로 복귀)
    playScissorsAnimation(() => {
      setIsAnimating(false);
      // 애니메이션 완료 후 2초 후 idle로 복귀
      setTimeout(() => {
        setCurrentCharacter('idle');
      }, 2000);
    });
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
            <View style={styles.statsCard}>
              <View style={styles.statsContent}>
                {/* CO2 절감 */}
                <View style={styles.statItem}>
                  <Image source={imgCo2Icon} style={styles.statIcon} />
                  <Text variant="bodyS" color="#888888" align="center" style={styles.statLabel}>
                    CO2 절감
                  </Text>
                  <Text variant="headlineM" color="#333333" align="center" weight="bold" style={styles.statValue}>
                    20kg
                  </Text>
                </View>

                {/* 물 절감 */}
                <View style={styles.statItem}>
                  <Image source={imgWaterIcon} style={styles.statIcon} />
                  <Text variant="bodyS" color="#888888" align="center" style={styles.statLabel}>
                    물 절감
                  </Text>
                  <Text variant="headlineM" color="#333333" align="center" weight="bold" style={styles.statValue}>
                    35.4L
                  </Text>
                </View>

                {/* 에너지 절감 */}
                <View style={styles.statItem}>
                  <Image source={imgEnergyIcon} style={styles.statIcon} />
                  <Text variant="bodyS" color="#888888" align="center" style={styles.statLabel}>
                    에너지 절감
                  </Text>
                  <Text variant="headlineM" color="#333333" align="center" weight="bold" style={styles.statValue}>
                    12.6KWh
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
              {/* 화살표 */}
              <View style={styles.arrowContainer}>
                <Image source={{uri: imgPolygon1}} style={styles.arrowIcon} />
              </View>

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

                        // 1. 살짝 기울어진 상태로 왔다 갔다 (전부 360도 회전 대신)
                        {
                          rotate: scissorsRotate.interpolate({
                            inputRange: [0, 0.25, 0.5, 0.75, 1],
                            outputRange: ['-18deg', '-12deg', '-16deg', '-10deg', '-14deg'],
                          }),
                        },

                        // 2. X축: 대각선으로 좌우 3번 스윕 후 중앙으로
                        {
                          translateX: scissorsAnimX.interpolate({
                            inputRange: [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1],
                            outputRange: [-72, 72, -60, 60, -48, 48, 0],
                          }),
                        },

                        // 3. Y축: X랑 비슷하게 대각선 스윕
                        {
                          translateY: scissorsAnimY.interpolate({
                            inputRange: [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1],
                            outputRange: [-64, 64, -52, 52, -40, 40, 0],
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
                        scaleY: hoverAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1],
                        }),
                      },
                    ],
                    opacity: hoverAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 0.6],
                    }),
                  },
                ]}
              >
                <View style={styles.shadowEllipse} />
              </Animated.View>

              {/* 캐릭터 이름 배경 */}
              <View style={styles.characterNameContainer}>
                <Image source={{uri: imgEllipse1}} style={styles.characterNameBackground} />
              </View>
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
                    <Text variant="bodyM" color="#06b0b7">{currentExp}/100 EXP</Text>
                  </View>
                </View>
                
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <LinearGradient
                        colors={['#06b0b7', '#08d4dc']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={[styles.progressBarFill, { width: `${currentExp}%` }]}
                      />
                    </View>
                  </View>
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
                colors={isAnimating || currentRepairs <= 0 ? ['#CCCCCC', '#CCCCCC'] : ['#8a3fb8', '#8a3fb8']}
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
      </LinearGradient>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  statLabel: {
    marginBottom: 4,
  },
  statValue: {
    marginTop: 4,
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
    marginTop: -4,
    marginBottom: 8,
  },
  shadowEllipse: {
    width: 120,
    height: 20,
    borderRadius: 60,
    backgroundColor: '#D1D5DB',
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
    marginBottom: 6,
  },
  actionButtonLabel: {
    fontSize: 12,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    position: 'relative',
    overflow: 'visible',
    minHeight: 140,
  },
  levelContent: {
    position: 'relative',
    paddingVertical: 20,
    paddingHorizontal: 21,
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
    paddingTop: 16,
  },
  progressBarContainer: {
    marginBottom: 0,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '75%', // 75/100 = 75%
    borderRadius: 9999,
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
    marginHorizontal: 24,
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
