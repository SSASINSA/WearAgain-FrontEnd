import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from '../../components/common/Text';
import DetailHeader from '../../components/common/DetailHeader';
import RankingIcon from '../../assets/icons/ranking.svg';
import ScissorsIcon from '../../assets/icons/scissors.svg';

const {width: screenWidth} = Dimensions.get('window');

// 이미지 상수들 (Figma에서 제공된 이미지들) - 변경 필요
const characterImages = {
  happy: require('../../assets/images/growing/weary_happy.png'),
  sad: require('../../assets/images/growing/weary_sad.png'),
  tired: require('../../assets/images/growing/weary_tired.png'),
  curious: require('../../assets/images/growing/weary_curious.png'),
};
const characterKeys = ['happy', 'sad', 'tired', 'curious'];

// 캐릭터 상태별 대사
const characterDialogues = {
  happy: '"안녕! 오늘도 멋진 하루가 될 것 같아!\n새로 수선한 옷을 입어볼까?"',
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
  const [currentCharacter, setCurrentCharacter] = React.useState('happy');

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <DetailHeader />,
    } as any);
  }, [navigation]);

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

  const handleRepairPress = () => {
    console.log('수선하기 버튼 클릭');
  };

  const handleRankingPress = () => {
    console.log('랭킹 버튼 클릭');
  };

  return (
    <LinearGradient
      colors={['#FAF5FF', '#ECFEFF']}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={styles.container}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <View style={styles.characterImageContainer}>
              <Image source={characterImages[currentCharacter as keyof typeof characterImages]} style={styles.characterImage} />
            </View>

            {/* 캐릭터 이름 배경 */}
            <View style={styles.characterNameContainer}>
              <Image source={{uri: imgEllipse1}} style={styles.characterNameBackground} />
            </View>
          </TouchableOpacity>

          {/* 랭킹 버튼 */}
          <View style={styles.actionButtons}>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity onPress={handleRankingPress} style={styles.actionButton}>
                <RankingIcon width={27} height={27} color="#FFFFFF" />
              </TouchableOpacity>
              <Text variant="bodyM" color="#374151" align="center" style={styles.dialogueText}>
              랭킹
              </Text>
            </View>
          </View>

          {/* 레벨 진행률 바 */}
          <View style={styles.levelCard}>
            <View style={styles.levelContent}>
              <View style={styles.levelTextContainer}>
                <Text variant="bodyM" color="#6B7280">다음 레벨까지</Text>
                <Text variant="bodyM" color="#06b0b7">75/100 EXP</Text>
              </View>
              
              <View style={styles.progressBarWrapper}>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <LinearGradient
                      colors={['#06b0b7', '#08d4dc']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.progressBarFill}
                    />
                  </View>
                </View>
              </View>

              {/* 레벨 배지 */}
              <LinearGradient
                colors={['#06b0b7', '#08d4dc']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.levelBadge}
              >
                <Text variant="bodyL" color="#FFFFFF" weight="bold">Lv.15</Text>
              </LinearGradient>
            </View>
          </View>

          {/* 수선하기 버튼 */}
          <TouchableOpacity onPress={handleRepairPress} style={styles.repairButton}>
            <LinearGradient
              colors={['#8a3fb8', '#8a3fb8']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.repairButtonGradient}
            >
              <ScissorsIcon width={16} height={16} color="#FFFFFF" />
              <Text variant="bodyL" color="#FFFFFF" weight="bold">수선하기</Text>
              <Text variant="bodyL" color="#FFFFFF" weight="bold">5</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
    marginTop: 24,
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
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
    marginTop: 24,
    marginRight: 24,
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
    marginBottom: 8,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    position: 'relative',
    overflow: 'visible',
  },
  levelContent: {
    position: 'relative',
    paddingVertical: 20,
    paddingHorizontal: 21,
  },
  levelTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    position: 'absolute',
    top: -16,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    minWidth: 54,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  repairButton: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
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
