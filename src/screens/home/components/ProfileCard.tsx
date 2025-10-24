import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text as CustomText } from '../../../components/common/Text';
import ClothIcon from '../../../assets/icons/clothIcon.svg';
import CreditIcon from '../../../assets/icons/creditIcon.svg';
import TicketIcon from '../../../assets/icons/ticketIcon.svg';

interface UserStat {
  id: string;
  label: string;
  value: number;
}

interface UserStats {
  level: number;
  name: string;
  stats: UserStat[];
}
interface ProfileCardProps {
  userStats: UserStats;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ userStats }) => {
  const renderStatIcon = (statId: string) => {
    switch (statId) {
      case 'clothes':
        return <ClothIcon width={36} height={36} style={styles.statIcon} />;
      case 'credit':
        return <CreditIcon width={36} height={36} style={styles.statIcon} />;
      case 'ticket':
        return <TicketIcon width={36} height={36} style={styles.statIcon} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <CustomText variant="bodyM" color="#555555">
          Lv. {userStats.level}
        </CustomText>
        <CustomText variant="headlineS" color="#111111" weight="bold">
          {' '}{userStats.name} 님
        </CustomText>
      </View>
      
      <View style={styles.statsContainer}>
        {userStats.stats.map((stat) => (
          <View key={stat.id} style={styles.statItem}>
            {renderStatIcon(stat.id)}
            <CustomText variant="bodyS" color="#888888" align="center">
              {stat.label}
            </CustomText>
            <CustomText variant="headlineL" color="#333333" weight="bold" align="center">
              {stat.value.toLocaleString()}
            </CustomText>
          </View>
        ))}
      </View>

      {/* 내 옷 키우러 가기 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.growButton}>
          <CustomText variant="labelM" color="#FFFFFF" weight="bold" align="center">
            내 옷 키우러 가기 🌱
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    paddingBottom: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: 16,
    marginBottom: 10,
    height: 112,
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
  buttonContainer: {
    marginHorizontal: -24,
    marginTop: 0,
  },
  growButton: {
    backgroundColor: '#06B0B7',
    height: 46,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
