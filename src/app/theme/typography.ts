import {Platform, TextStyle} from 'react-native';

// Pretendard 폰트 패밀리 정의
const pretendardBold = Platform.select({
  ios: 'Pretendard-Bold',
  android: 'pretendard_bold',
});

const pretendardSemiBold = Platform.select({
  ios: 'Pretendard-SemiBold',
  android: 'pretendard_semi_bold',
});

const pretendardRegular = Platform.select({
  ios: 'Pretendard-Regular',
  android: 'pretendard_regular',
});

// Android 스타일의 타이포그래피 정의
export const typography = {
  // Display 스타일
  displayL: {
    fontFamily: pretendardBold,
    fontSize: 28,
    letterSpacing: -0.02 * 28, // -0.02em
    lineHeight: 40,
  } as TextStyle,

  displayM: {
    fontFamily: pretendardBold,
    fontSize: 24,
    letterSpacing: -0.02 * 24, // -0.02em
    lineHeight: 34,
  } as TextStyle,

  // Headline 스타일
  headlineL: {
    fontFamily: pretendardBold,
    fontSize: 20,
    letterSpacing: -0.02 * 20, // -0.02em
    lineHeight: 28,
  } as TextStyle,

  headlineM: {
    fontFamily: pretendardBold,
    fontSize: 18,
    letterSpacing: -0.02 * 18, // -0.02em
    lineHeight: 25,
  } as TextStyle,

  headlineS: {
    fontFamily: pretendardBold,
    fontSize: 16,
    letterSpacing: -0.02 * 16, // -0.02em
    lineHeight: 22,
  } as TextStyle,

  // Label 스타일
  labelL: {
    fontFamily: pretendardSemiBold,
    fontSize: 16,
    letterSpacing: -0.02 * 16, // -0.02em
    lineHeight: 22,
  } as TextStyle,

  labelM: {
    fontFamily: pretendardSemiBold,
    fontSize: 14,
    letterSpacing: -0.02 * 14, // -0.02em
    lineHeight: 20,
  } as TextStyle,

  labelS: {
    fontFamily: pretendardSemiBold,
    fontSize: 11,
    letterSpacing: -0.02 * 11, // -0.02em
    lineHeight: 15,
  } as TextStyle,

  // Body 스타일
  bodyL: {
    fontFamily: pretendardRegular,
    fontSize: 16,
    letterSpacing: -0.02 * 16, // -0.02em
    lineHeight: 22,
  } as TextStyle,

  bodyM: {
    fontFamily: pretendardRegular,
    fontSize: 14,
    letterSpacing: -0.02 * 14, // -0.02em
    lineHeight: 20,
  } as TextStyle,

  bodyS: {
    fontFamily: pretendardRegular,
    fontSize: 12,
    letterSpacing: -0.02 * 12, // -0.02em
    lineHeight: 17,
  } as TextStyle,

  bodyS2: {
    fontFamily: pretendardRegular,
    fontSize: 11,
    letterSpacing: -0.02 * 11, // -0.02em
    lineHeight: 15,
  } as TextStyle,

  // 폰트 패밀리 (개별 사용을 위해)
  fontFamily: {
    regular: pretendardRegular,
    semiBold: pretendardSemiBold,
    bold: pretendardBold,
  },

  // 폰트 크기 (개별 사용을 위해)
  fontSize: {
    displayL: 28,
    displayM: 24,
    headlineL: 20,
    headlineM: 18,
    headlineS: 16,
    labelL: 16,
    labelM: 14,
    labelS: 11,
    bodyL: 16,
    bodyM: 14,
    bodyS: 12,
    bodyS2: 11,
  },

  // 폰트 가중치
  fontWeight: {
    regular: '400' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
} as const;

export type Typography = typeof typography;
