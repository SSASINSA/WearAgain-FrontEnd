import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Linking,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {performSocialLogin} from '../../api/auth/socialLogin';
import {mapAuthErrorToMessage} from '../../api/auth/errorMessages';
import {Text} from '../../components/common/Text';
import {SocialLoginButton} from '../../components/login/SocialLoginButton';
import type {AuthCallbackResponse, SocialProvider} from '../../types/auth';

interface LoginScreenProps {
  onProviderPress?: (provider: SocialProvider) => Promise<void> | void;
  initialErrorMessage?: string | null;
  onTemporaryContinue?: () => void;
  onLoginSuccess?: (payload: AuthCallbackResponse) => void;
}

interface ProviderConfig {
  id: SocialProvider;
  label: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  iconBackground: string;
  iconColor: string;
  iconLabel: string;
}

const COLORS = {
  background: '#F7F7FA',
  primaryText: '#111111',
  secondaryText: '#7A7F87',
  kakao: '#FEE500',
  googleBorder: '#DFDFDF',
  googleText: '#333333',
  apple: '#1C1C1E',
  legalHighlight: '#111111',
  errorBackground: '#FFEAEA',
  errorText: '#C62828',
};

const LEGAL_LINKS = {
  terms: 'https://wearagain.co.kr/terms',
  privacy: 'https://wearagain.co.kr/privacy',
};

const ILLUSTRATION: ImageSourcePropType = require('../../assets/images/login/login-illustration.png');

const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    id: 'kakao',
    label: '카카오로 로그인',
    backgroundColor: COLORS.kakao,
    textColor: COLORS.primaryText,
    iconBackground: '#3C1E1E',
    iconColor: COLORS.kakao,
    iconLabel: 'K',
  },
  {
    id: 'apple',
    label: 'Apple ID로 로그인',
    backgroundColor: COLORS.apple,
    textColor: '#FBFBFB',
    iconBackground: COLORS.apple,
    iconColor: '#FBFBFB',
    iconLabel: '',
  },
  {
    id: 'google',
    label: 'Google로 로그인',
    backgroundColor: '#FFFFFF',
    textColor: COLORS.googleText,
    borderColor: COLORS.googleBorder,
    iconBackground: '#FFFFFF',
    iconColor: '#4285F4',
    iconLabel: 'G',
  },
];

function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Promise<T>).then === 'function'
  );
}

function LetterIcon({
  label,
  backgroundColor,
  color,
}: {
  label: string;
  backgroundColor: string;
  color: string;
}) {
  return (
    <View style={[styles.letterIcon, {backgroundColor}]}>
      <Text variant="labelM" align="center" color={color}>
        {label}
      </Text>
    </View>
  );
}

function ErrorBanner({message}: {message: string}) {
  return (
    <View style={styles.errorContainer}>
      <Text variant="bodyS" align="center" color={COLORS.errorText}>
        {message}
      </Text>
    </View>
  );
}

export default function LoginScreen({
  onProviderPress,
  initialErrorMessage = null,
  onTemporaryContinue,
  onLoginSuccess,
}: LoginScreenProps) {
  const [loadingProvider, setLoadingProvider] =
    React.useState<SocialProvider | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    initialErrorMessage,
  );

  const handleOpenLink = React.useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      // 외부 링크가 열리지 않는 경우에도 크래시를 방지
    });
  }, []);

  const handleProviderPress = React.useCallback(
    async (provider: SocialProvider) => {
      if (loadingProvider) {
        return;
      }

      setErrorMessage(null);
      setLoadingProvider(provider);

      try {
        if (onProviderPress) {
          const result = onProviderPress(provider);
          if (isPromise(result)) {
            await result;
          }
          return;
        }
        const loginResult = await performSocialLogin(provider);
        onLoginSuccess?.(loginResult);
        onTemporaryContinue?.();
      } catch (error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error('Social login failed', error);
        }

        const readableMessage = mapAuthErrorToMessage(provider, error);
        setErrorMessage(readableMessage);
      } finally {
        setLoadingProvider(null);
      }
    },
    [loadingProvider, onLoginSuccess, onProviderPress, onTemporaryContinue],
  );

  const isLoading = React.useMemo(() => loadingProvider !== null, [loadingProvider]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.topSection}>
              <View style={styles.illustrationWrapper}>
                <Image
                  source={ILLUSTRATION}
                  style={styles.illustration}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.titleWrapper}>
                <Text variant="displayL" align="center" color={COLORS.primaryText}>
                  로그인
                </Text>
                <Text
                  variant="bodyM"
                  align="center"
                  color={COLORS.secondaryText}
                  style={styles.subtitle}>
                  간편하게 로그인하고 WearAgain을 시작하세요
                </Text>
              </View>
            </View>

            <View style={styles.buttonSection}>
              {errorMessage ? <ErrorBanner message={errorMessage} /> : null}
              {PROVIDER_CONFIGS.map(config => (
                <SocialLoginButton
                  key={config.id}
                  label={config.label}
                  backgroundColor={config.backgroundColor}
                  textColor={config.textColor}
                  borderColor={config.borderColor}
                  loading={loadingProvider === config.id}
                  disabled={isLoading && loadingProvider !== config.id}
                  onPress={() => {
                    void handleProviderPress(config.id);
                  }}
                  borderRadius={12}
                  icon={
                    <LetterIcon
                      label={config.iconLabel}
                      backgroundColor={config.iconBackground}
                      color={config.iconColor}
                    />
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.legalSection}>
            <Text variant="bodyS" align="center" color={COLORS.secondaryText}>
              시작함으로써{' '}
              <Text
                variant="bodyS"
                color={COLORS.legalHighlight}
                style={styles.legalLink}
                onPress={() => handleOpenLink(LEGAL_LINKS.terms)}>
                이용약관
              </Text>
              과{' '}
              <Text
                variant="bodyS"
                color={COLORS.legalHighlight}
                style={styles.legalLink}
                onPress={() => handleOpenLink(LEGAL_LINKS.privacy)}>
                개인정보 처리방침
              </Text>
              에 동의합니다.
            </Text>
            {onTemporaryContinue ? (
              <View style={styles.tempButtonWrapper}>
                <SocialLoginButton
                  label="임시로 홈 화면 이동"
                  onPress={onTemporaryContinue}
                  backgroundColor="#FFFFFF"
                  textColor={COLORS.primaryText}
                  borderColor={COLORS.googleBorder}
                />
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={styles.bottomSafe} />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomSafe: {
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 48,
  },
  topSection: {
    alignItems: 'center',
    gap: 28,
  },
  illustrationWrapper: {
    alignItems: 'center',
  },
  illustration: {
    width: 200,
    height: 177,
  },
  titleWrapper: {
    gap: 8,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 4,
  },
  buttonSection: {
    gap: 12,
  },
  letterIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.errorBackground,
  },
  legalSection: {
    marginTop: 32,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
  tempButtonWrapper: {
    marginTop: 16,
  },
});
