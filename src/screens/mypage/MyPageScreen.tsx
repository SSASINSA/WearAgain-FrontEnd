import React, {useMemo} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import {Text} from '../../components/common/Text';
import {useAuthStore} from '../../store/auth.store';
import TicketIcon from '../../assets/icons/ticket.svg';
import PromoImage from '../../assets/images/more-promo.png';

type MenuItemProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  showDivider?: boolean;
};

function MenuItem({label, icon, onPress, showDivider = true}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, showDivider && styles.menuDivider]}
      onPress={onPress}>
      <View style={styles.menuLeft}>
        {icon}
        <Text variant="bodyM" color="#1F2937" style={styles.menuLabel}>
          {label}
        </Text>
      </View>
      <ChevronRightIcon />
    </TouchableOpacity>
  );
}

export default function MyPageScreen() {
  const navigation = useNavigation();
  const userName = useAuthStore(state => state.user?.nickname);
  const logout = useAuthStore(state => state.logout);

  const displayName = useMemo(() => userName ?? '사용자', [userName]);

  const handlePressApplications = () => {
    const tabNavigation = navigation.getParent();
    const rootNavigation = tabNavigation?.getParent();

    if (rootNavigation) {
      rootNavigation.navigate('ApplicationsStack' as never);
      return;
    }

    navigation.navigate('ApplicationsStack' as never);
  };

  const handlePressOrders = () => {
    const tabNavigation = navigation.getParent();
    const rootNavigation = tabNavigation?.getParent();
    if (rootNavigation) {
      (rootNavigation as any).navigate('Store', {screen: 'Order'});
      return;
    }
    (navigation as any).navigate('Store', {screen: 'Order'});
  };

  const handlePressProfile = () => {
    Alert.alert('안내', '내정보 편집 화면은 준비 중입니다.');
  };

  const handlePressInquiry = () => {
    Alert.alert('안내', '문의하기 화면은 준비 중입니다.');
  };

  const handlePressTerms = () => {
    Alert.alert('안내', '서비스 이용 약관은 추후 연결됩니다.');
  };

  const handlePressOss = () => {
    Alert.alert('안내', '오픈소스 라이센스 화면은 준비 중입니다.');
  };

  const handlePressPromo = () => {
    Alert.alert('21% 파티란?', '프로모션 상세는 추후 연결됩니다.');
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.greetingCard}>
          <View>
            <Text variant="bodyL" weight="semiBold" color="#111827">
              {displayName}
            </Text>
            <Text variant="bodyM" color="#6B7280">
              님 반갑습니다.
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogoutIcon />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.promoCard} onPress={handlePressPromo}>
          <Image source={PromoImage} style={styles.promoImage} />
          <Text variant="bodyM" color="#111827">
            21% 파티란 ?
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text variant="bodyM" weight="semiBold" color="#111827">
            계정
          </Text>
          <View style={styles.menuGroup}>
            <MenuItem
              label="내정보"
              icon={<ProfileIcon />}
              onPress={handlePressProfile}
            />
            <MenuItem
              label="신청 내역"
              icon={<TicketIcon width={20} height={20} />}
              onPress={handlePressApplications}
            />
            <MenuItem
              label="주문 내역"
              icon={<TicketIcon width={20} height={20} />}
              onPress={handlePressOrders}
              showDivider={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="bodyM" weight="semiBold" color="#111827">
            기타
          </Text>
          <View style={styles.menuGroup}>
            <MenuItem
              label="문의하기"
              icon={<QuestionIcon />}
              onPress={handlePressInquiry}
            />
            <MenuItem
              label="서비스 이용 약관"
              icon={<DocumentIcon />}
              onPress={handlePressTerms}
            />
            <MenuItem
              label="오픈소스 라이센스"
              icon={<CodeIcon />}
              onPress={handlePressOss}
              showDivider={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={7.5} r={3.5} stroke="#111827" strokeWidth={1.5} />
      <Path
        d="M5 19c0-3 3.5-5.5 7-5.5s7 2.5 7 5.5"
        stroke="#111827"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function QuestionIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke="#111827" strokeWidth={1.5} />
      <Path
        d="M11.5 15h1v-1c0-1.3333 2-1.3333 2-3 0-1.1046-.8954-2-2-2s-2 .8954-2 2"
        stroke="#111827"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={17.5} r={0.75} fill="#111827" />
    </Svg>
  );
}

function DocumentIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect
        x={5}
        y={4}
        width={14}
        height={16}
        rx={2}
        stroke="#111827"
        strokeWidth={1.5}
      />
      <Path
        d="M9 9h6M9 13h6M9 17h3"
        stroke="#111827"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CodeIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 8 5 12l4 4M15 8l4 4-4 4"
        stroke="#111827"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRightIcon() {
  return (
    <Svg width={9} height={14} viewBox="0 0 9 14" fill="none">
      <Path
        d="M1 1.5 7 7l-6 5.5"
        stroke="#9CA3AF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LogoutIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1"
        stroke="#111827"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M13 12H3m0 0 2.5-2.5M3 12l2.5 2.5"
        stroke="#111827"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  greetingCard: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 4,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutButton: {
    padding: 6,
  },
  promoCard: {
    marginTop: 20,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  promoImage: {
    width: 48,
    height: 48,
    marginRight: 12,
    borderRadius: 8,
  },
  section: {
    marginTop: 24,
  },
  menuGroup: {
    marginTop: 12,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  menuItem: {
    height: 52,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F7',
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    marginLeft: 12,
  },
});
