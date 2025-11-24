import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  ListRenderItem,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '../../components/common/Text';
import DetailHeader from '../../components/common/DetailHeader';
import { RankingUser, UserRankingInfo } from '../../types/ranking';
import { apiClient } from '../../api/client';

const { width: screenWidth } = Dimensions.get('window');

// 네비게이션 타입 정의
type NavigationProps = {
  navigate: (name: string, params?: any) => void;
  setOptions: (options: any) => void;
};

// API 응답 타입
interface RankUser {
  rank: number;
  nickname: string;
  repairCount: number;
  rankChange: number;
}

interface RankingApiResponse {
  comparedSnapshotDate: string;
  topRanks: RankUser[];
  me: RankUser;
}

// Mock 데이터 - 실제로는 API에서 가져와야함
const mockUserRankingInfo: UserRankingInfo = {
  currentRank: 12,
  currentLevel: 15,
  totalCo2Reduced: 20,
  totalWaterSaved: 35.4,
  totalEnergySaved: 12.6,
  totalRepairs: 48,
  totalUsers: 1250,
};

// 폴백용 빈 배열 (API가 실패할 경우)
const mockRankings: RankingUser[] = [];

// 기존 mock 데이터 (주석 처리, 필요시 참고용)
// const mockRankingsOld: RankingUser[] = [
//   {
//     rank: 1,
//     userId: 'user001',
//     userName: '환경맨',
//     level: 45,
//     totalCo2Reduced: 250,
//     totalWaterSaved: 450.2,
//     totalEnergySaved: 156.8,
//     totalRepairs: 320,
//     rankChange: 0,
//     previousRank: 2,
//   },
//   {
//     rank: 2,
//     userId: 'user002',
//     userName: '지구보호자',
//     level: 42,
//     totalCo2Reduced: 230,
//     totalWaterSaved: 420.5,
//     totalEnergySaved: 145.2,
//     totalRepairs: 298,
//     rankChange: 1,
//     previousRank: 1,
//   },
//   {
//     rank: 3,
//     userId: 'user003',
//     userName: 'Saver',
//     level: 39,
//     totalCo2Reduced: 200,
//     totalWaterSaved: 385.0,
//     totalEnergySaved: 130.5,
//     totalRepairs: 265,
//     rankChange: -1,
//     previousRank: 3,
//   },
//   {
//     rank: 4,
//     userId: 'user004',
//     userName: '친환경킹',
//     level: 38,
//     totalCo2Reduced: 195,
//     totalWaterSaved: 368.2,
//     totalEnergySaved: 125.3,
//     totalRepairs: 258,
//     rankChange: 2,
//     previousRank: 6,
//   },
//   {
//     rank: 5,
//     userId: 'user005',
//     userName: '수선마스터',
//     level: 36,
//     totalCo2Reduced: 180,
//     totalWaterSaved: 340.8,
//     totalEnergySaved: 118.6,
//     totalRepairs: 245,
//     rankChange: -2,
//     previousRank: 3,
//   },
//   {
//     rank: 6,
//     userId: 'user006',
//     userName: '초록이',
//     level: 34,
//     totalCo2Reduced: 165,
//     totalWaterSaved: 315.6,
//     totalEnergySaved: 112.3,
//     totalRepairs: 230,
//     rankChange: 1,
//     previousRank: 7,
//   },
//   {
//     rank: 7,
//     userId: 'user009',
//     userName: '환경전사',
//     level: 32,
//     totalCo2Reduced: 155,
//     totalWaterSaved: 295.2,
//     totalEnergySaved: 105.8,
//     totalRepairs: 215,
//     rankChange: -1,
//     previousRank: 6,
//   },
//   {
//     rank: 8,
//     userId: 'user010',
//     userName: '지구지킴이',
//     level: 30,
//     totalCo2Reduced: 145,
//     totalWaterSaved: 280.5,
//     totalEnergySaved: 98.4,
//     totalRepairs: 200,
//     rankChange: 0,
//     previousRank: 8,
//   },
//   {
//     rank: 9,
//     userId: 'user011',
//     userName: '에코프렌드',
//     level: 28,
//     totalCo2Reduced: 135,
//     totalWaterSaved: 265.3,
//     totalEnergySaved: 92.1,
//     totalRepairs: 188,
//     rankChange: 2,
//     previousRank: 11,
//   },
//   {
//     rank: 10,
//     userId: 'user012',
//     userName: '수선영웅',
//     level: 26,
//     totalCo2Reduced: 125,
//     totalWaterSaved: 250.8,
//     totalEnergySaved: 86.5,
//     totalRepairs: 175,
//     rankChange: -1,
//     previousRank: 9,
//   },
//   {
//     rank: 12,
//     //userId: 'currentUser',
//     userId: 'tempUSer',
//     userName: '나',
//     level: 15,
//     totalCo2Reduced: 20,
//     totalWaterSaved: 35.4,
//     totalEnergySaved: 12.6,
//     totalRepairs: 48,
//     isCurrentUser: true,
//     rankChange: -3,
//     previousRank: 15,
//   },
//   {
//     rank: 13,
//     userId: 'user007',
//     userName: '초보자',
//     level: 14,
//     totalCo2Reduced: 18,
//     totalWaterSaved: 32.1,
//     totalEnergySaved: 11.2,
//     totalRepairs: 42,
//     rankChange: 1,
//     previousRank: 12,
//   },
//   {
//     rank: 14,
//     userId: 'user008',
//     userName: '환경러',
//     level: 13,
//     totalCo2Reduced: 16,
//     totalWaterSaved: 29.5,
//     totalEnergySaved: 10.1,
//     totalRepairs: 38,
//     rankChange: 0,
//     previousRank: 14,
//   },
// ];

const imgCo2Icon = require('../../assets/icons/co2.png');
const imgWaterIcon = require('../../assets/icons/water_drop.png');
const imgEnergyIcon = require('../../assets/icons/energy.png');

export default function RankingScreen() {
  const navigation = useNavigation() as NavigationProps;
  const [rankingData, setRankingData] = React.useState<RankingApiResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    } as any);
  }, [navigation]);

  // API에서 랭킹 데이터 조회
  React.useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await apiClient.get<RankingApiResponse>('/growth/ranking');
        setRankingData(response.data);
      } catch (error) {
        console.error('랭킹 데이터 조회 실패:', error);
        Alert.alert('오류', '랭킹 데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  // API 데이터로 RankingUser 배열 변환
  const convertToRankingUsers = (apiData: RankingApiResponse): RankingUser[] => {
    const currentUserRank = apiData.me.rank;
    
    const converted = apiData.topRanks.map((rank) => ({
      rank: rank.rank,
      userId: `user_${rank.rank}`,
      userName: rank.nickname,
      level: 1, // API에서 제공하지 않음, 기본값 사용
      totalCo2Reduced: 0, // API에서 제공하지 않음
      totalWaterSaved: 0, // API에서 제공하지 않음
      totalEnergySaved: 0, // API에서 제공하지 않음
      totalRepairs: rank.repairCount,
      rankChange: rank.rankChange,
      previousRank: rank.rank - rank.rankChange,
      // 현재 사용자인지 확인 (rank와 nickname으로 비교)
      isCurrentUser: rank.rank === currentUserRank && rank.nickname === apiData.me.nickname,
    }));
    
    // 현재 사용자가 상위 10명에 없으면 추가 (10등 밖일 경우)
    if (!converted.some(item => item.isCurrentUser)) {
      converted.push({
        rank: apiData.me.rank,
        userId: `user_${apiData.me.rank}`,
        userName: apiData.me.nickname,
        level: 1,
        totalCo2Reduced: 0,
        totalWaterSaved: 0,
        totalEnergySaved: 0,
        totalRepairs: apiData.me.repairCount,
        rankChange: apiData.me.rankChange,
        previousRank: apiData.me.rank - apiData.me.rankChange,
        isCurrentUser: true,
      });
    }
    
    return converted;
  };

  // 현재 사용자와 상위 10명 데이터
  const rankings = rankingData ? convertToRankingUsers(rankingData) : [];
  const currentUser = rankings.find(item => item.isCurrentUser);
  
  const topTenUsers = rankings.filter(item => item.rank <= 10).sort((a, b) => a.rank - b.rank);
  const isCurrentUserInTopTen = currentUser && currentUser.rank <= 10;

  // 표시할 랭킹 데이터 구성
  const getRankingDisplayData = (): (RankingUser | { type: string })[] => {
    if (isCurrentUserInTopTen) {
      // 사용자가 1-10등 안에 있는 경우: 위아래 공백과 함께 표시
      // API에서 이미 me가 topRanks에 포함되어 있으므로, topTenUsers만 반환
      return [
        { type: 'spacer-top' },
        ...topTenUsers,
        { type: 'spacer-bottom' },
      ];
    } else if (currentUser) {
      // 사용자가 10등 밖인 경우: 1-10등, 공백, 점, 사용자 순서
      // currentUser는 topTenUsers에 없으므로 별도로 추가
      return [
        ...topTenUsers,
        { type: 'spacer' },
        { type: 'dots' },
        currentUser,
      ];
    }
    return topTenUsers;
  };

  const rankingDisplayData = getRankingDisplayData();

  // 랭킹 변동 상태에 따른 아이콘 및 색상 반환
  const getRankChangeDisplay = (rankChange?: number) => {
    if (rankChange === undefined || rankChange === 0) {
      return { icon: '→', color: '#9CA3AF', label: '유지' };
    } else if (rankChange > 0) {
      return { icon: '↑', color: '#10B981', label: `+${rankChange}` };
    } else {
      return { icon: '↓', color: '#EF4444', label: `-${Math.abs(rankChange)}` };
    }
  };

  // 시상대 카드 렌더
  const renderPodiumCard = () => {
    const topThree = rankings.filter(item => item.rank <= 3).sort((a, b) => a.rank - b.rank);
    const MAX_HEIGHT = 160;

    const getPodiumColor = (rank: number) => {
      switch (rank) {
        case 1:
          return ['#FFD700', '#FFA500'];
        case 2:
          return ['#C0C0C0', '#A9A9A9'];
        case 3:
          return ['#CD7F32', '#8B4513'];
        default:
          return ['#06b0b7', '#08d4dc'];
      }
    };

    const getPodiumHeight = (rank: number) => {
      // 1등의 totalRepairs를 기준값으로 사용
      const firstPlaceRepairs = topThree[0]?.totalRepairs || 1;
      
      let userRepairs = 0;
      if (rank === 1 && topThree[0]) {
        userRepairs = topThree[0].totalRepairs;
      } else if (rank === 2 && topThree[1]) {
        userRepairs = topThree[1].totalRepairs;
      } else if (rank === 3 && topThree[2]) {
        userRepairs = topThree[2].totalRepairs;
      }

      // 비율 계산: (사용자 수선횟수 / 1등 수선횟수) * MAX_HEIGHT
      const height = (userRepairs / firstPlaceRepairs) * MAX_HEIGHT;
      return Math.max(height, 40); // 최소 높이 40으로 설정
    };

    return (
      <View style={styles.podiumContainer}>
        <Text variant="bodyM" color="#374151" weight="bold" style={styles.podiumTitle}>
          환경 지킴이 TOP 3
        </Text>
        <View style={styles.podiumContent}>
          {/* 2등 */}
          {topThree[1] && (
            <View style={styles.podiumColumn}>
              <LinearGradient
                colors={getPodiumColor(2)}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.podiumBar, { height: getPodiumHeight(2) }]}
              >
                <View style={styles.podiumRankBadge}>
                  <Text variant="bodyM" color="#FFFFFF" weight="bold">
                    2
                  </Text>
                </View>
              </LinearGradient>
              <Text variant="bodyS" color="#374151" weight="bold" style={styles.podiumName}>
                {topThree[1].userName}
              </Text>
              <Text variant="bodyS" color="#9CA3AF">
                {topThree[1].totalRepairs}회
              </Text>
            </View>
          )}

          {/* 1등 */}
          {topThree[0] && (
            <View style={styles.podiumColumn}>
              <LinearGradient
                colors={getPodiumColor(1)}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.podiumBar, { height: getPodiumHeight(1) }]}
              >
                <View style={styles.podiumRankBadge}>
                  <Text variant="bodyM" color="#FFFFFF" weight="bold">
                    👑
                  </Text>
                </View>
              </LinearGradient>
              <Text variant="bodyS" color="#374151" weight="bold" style={styles.podiumName}>
                {topThree[0].userName}
              </Text>
              <Text variant="bodyS" color="#9CA3AF">
                {topThree[0].totalRepairs}회
              </Text>
            </View>
          )}

          {/* 3등 */}
          {topThree[2] && (
            <View style={styles.podiumColumn}>
              <LinearGradient
                colors={getPodiumColor(3)}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.podiumBar, { height: getPodiumHeight(3) }]}
              >
                <View style={styles.podiumRankBadge}>
                  <Text variant="bodyM" color="#FFFFFF" weight="bold">
                    3
                  </Text>
                </View>
              </LinearGradient>
              <Text variant="bodyS" color="#374151" weight="bold" style={styles.podiumName}>
                {topThree[2].userName}
              </Text>
              <Text variant="bodyS" color="#9CA3AF">
                {topThree[2].totalRepairs}회
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // 랭킹 아이템 렌더
  const renderRankingItem: ListRenderItem<any> = ({ item }) => {
    // spacer 또는 dots 타입 처리
    if (item.type === 'spacer-top' || item.type === 'spacer-bottom' || item.type === 'spacer') {
      return (
        <View style={styles.spacerContainer} />
      );
    }

    if (item.type === 'dots') {
      return (
        <View style={styles.dotsContainer}>
          <Text variant="bodyM" color="#D1D5DB" align="center">
            · · ·
          </Text>
        </View>
      );
    }

    // 일반 랭킹 아이템
    const rankChange = getRankChangeDisplay(item.rankChange);
    
    return (
      <View
        style={[
          styles.rankingItem,
          item.isCurrentUser && styles.rankingItemHighlight,
        ]}
      >
        {/* 순위 배지 */}
        <View style={styles.rankBadgeContainer}>
          {item.rank <= 3 ? (
            <LinearGradient
              colors={
                item.rank === 1
                  ? ['#FFD700', '#FFA500']
                  : item.rank === 2
                  ? ['#C0C0C0', '#A9A9A9']
                  : ['#CD7F32', '#8B4513']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.rankBadge}
            >
              <Text
                variant="bodyM"
                color="#FFFFFF"
                weight="bold"
                align="center"
              >
                {item.rank}
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.rankBadgeNormal}>
              <Text
                variant="bodyM"
                color="#6B7280"
                weight="bold"
                align="center"
              >
                {item.rank}
              </Text>
            </View>
          )}
        </View>

        {/* 사용자 정보 */}
        <View style={styles.userInfo}>
          <View style={styles.userNameContainer}>
            <Text variant="bodyM" color="#374151" weight="bold">
              {item.userName}
            </Text>
          </View>
        </View>

        {/* 통계 */}
        <View style={styles.statsContainer}>
          <Text variant="bodyS" color="#9CA3AF">
            수선 {item.totalRepairs}회
          </Text>
        </View>

        {/* 랭킹 변동 */}
        <View style={styles.rankChangeContainer}>
          <Text variant="bodyS" color={rankChange.color} weight="bold">
            {rankChange.icon}
          </Text>
          {item.rankChange !== 0 && (
            <Text variant="bodyS" color={rankChange.color} weight="bold">
              {rankChange.label}
            </Text>
          )}
        </View>

      </View>
    );
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <LinearGradient
          colors={['#FAF5FF', '#ECFEFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.container}
        >
          <DetailHeader title="랭킹" />
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text variant="headlineM" color="#374151" align="center">
              랭킹을 불러오는 중...
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#FAF5FF', '#ECFEFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <DetailHeader title="랭킹" />
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
          {/* 시상대 */}
          {renderPodiumCard()}

          {/* 랭킹 리스트 섹션 헤더 */}
          <View style={styles.rankingListHeader}>
            <View style={styles.rankingListTitleContainer}>
              <Text variant="bodyM" color="#374151" weight="bold">
                전체 랭킹
              </Text>
            </View>            
          </View>

          {/* 랭킹 리스트 */}
          <View style={styles.rankingListContainer}>
            <FlatList
              data={rankingDisplayData}
              renderItem={renderRankingItem}
              keyExtractor={(item: any, index) => {
                if (item.type) return `${item.type}-${index}`;
                return `${item.userId}-${item.rank}`;
              }}
              scrollEnabled={false}
              ItemSeparatorComponent={({ leadingItem, trailingItem }) => {
                // spacer나 dots 타입 주변에는 구분선 없음
                if (leadingItem?.type || trailingItem?.type) return null;
                return <View style={styles.separator} />;
              }}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  podiumContainer: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  podiumTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  podiumContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2
  },
  podiumColumn: {
    alignItems: 'center',
    width: 90,
  },
  podiumBar: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: 70,
  },
  podiumRankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumName: {
    marginBottom: 4,
    textAlign: 'center',
  },
  userCurrentRankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  userCurrentRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userCurrentRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userRankCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userCurrentRankInfo: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  userCurrentRankRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userCurrentLevelBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#06b0b7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userStatsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  userStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userStatIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  userStatContent: {
    flex: 1,
  },
  rankingListHeader: {
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 4,
  },
  rankingListTitleContainer: {
    marginBottom: 12,
  },
  rankingListLegend: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankingListContainer: {
    marginHorizontal: 24,
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  flatListContent: {
    paddingVertical: 8,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rankingItemHighlight: {
    backgroundColor: '#F0FEFF',
    borderWidth: 2,
    borderColor: '#06b0b7',
    borderRadius: 8,
    marginVertical: 12,
  },
  rankBadgeContainer: {
    marginRight: 4,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeNormal: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelBadge: {
    backgroundColor: '#06b0b7',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  rankChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 12,
    minWidth: 40,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  spacerContainer: {
    backgroundColor: 'transparent',
  },
  dotsContainer: {
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

