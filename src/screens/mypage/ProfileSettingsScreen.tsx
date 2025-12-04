import React, {useMemo, useState} from 'react';
import {Alert, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '../../components/common/Text';
import DetailHeader from '../../components/common/DetailHeader';
import {useAuth, useUserSummary} from '../../hooks/useAuth';
import {userApi} from '../../api/userApi';
import {useAuthStore} from '../../store/auth.store';

export default function ProfileSettingsScreen() {
  const {data: summary} = useUserSummary();
  const {data: authUser} = useAuth();
  const queryClient = useQueryClient();
  const logout = useAuthStore(state => state.logout);

  const initialNickname = useMemo(() => summary?.displayName ?? '', [summary?.displayName]);
  const [nickname, setNickname] = useState(initialNickname);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      return userApi.updateDisplayName(nickname);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user', 'summary']});
      Alert.alert('완료', '닉네임이 수정되었습니다.');
    },
    onError: () => {
      Alert.alert('오류', '닉네임 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return userApi.deleteAccount();
    },
    onSuccess: async () => {
      Alert.alert('탈퇴 완료', '계정이 삭제되었습니다.', [
        {
          text: '확인',
          onPress: async () => {
            await logout('계정이 삭제되었습니다.');
          },
        },
      ]);
    },
    onError: () => {
      Alert.alert('오류', '탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const handleSaveNickname = () => {
    if (!nickname.trim()) {
      Alert.alert('안내', '닉네임을 입력해주세요.');
      return;
    }
    updateProfileMutation.mutate();
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => {
          void logout();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '탈퇴하기',
      '정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '탈퇴하기',
          style: 'destructive',
          onPress: () => {
            deleteAccountMutation.mutate();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <DetailHeader title="설정" useTopInset />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text variant="bodyM" weight="semiBold" color="#111827">
            닉네임
          </Text>
          <View style={styles.nicknameRow}>
            <TextInput
              style={styles.nicknameInput}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력하세요"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveNickname}
              disabled={updateProfileMutation.isPending}>
              <Text
                variant="bodyM"
                weight="semiBold"
                color="#FFFFFF">
                저장
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="bodyM" weight="semiBold" color="#111827">
            계정
          </Text>
          <View style={styles.accountButtons}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}>
              <Text variant="bodyM" color="#111827">
                로그아웃
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}>
              <Text variant="bodyM" color="#EF4444">
                탈퇴하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  nicknameInput: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  saveButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountButtons: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F7F7F7',
    overflow: 'hidden',
  },
  logoutButton: {
    height: 52,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  deleteButton: {
    height: 52,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
});


