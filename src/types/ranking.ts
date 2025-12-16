export interface RankingUser {
  rank: number;
  userId: string;
  userName: string;
  profileImage?: string;
  level: number;
  totalCo2Reduced: number;
  totalWaterSaved: number;
  totalEnergySaved: number;
  totalRepairs: number;
  isCurrentUser?: boolean;
  rankChange?: number; // 이전 순위 대비 변동: 양수(상승), 음수(하락), 0(동일)
  previousRank?: number; // 이전 순위
}

export interface UserRankingInfo {
  currentRank: number;
  currentLevel: number;
  totalCo2Reduced: number;
  totalWaterSaved: number;
  totalEnergySaved: number;
  totalRepairs: number;
  totalUsers: number;
}

export interface RankingResponse {
  userInfo: UserRankingInfo;
  rankings: RankingUser[];
}

// API 응답 타입
export interface RankUser {
  rank: number;
  nickname: string;
  repairCount: number;
  rankChange: number;
}

export interface RankingApiResponse {
  comparedSnapshotDate: string;
  topRanks: RankUser[];
  me: RankUser | null; // 로그인하지 않은 경우 null
}

