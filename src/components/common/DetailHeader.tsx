import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back.svg';
import {Text} from './Text';

type DetailHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
  onPressBack?: () => void;
  containerStyle?: ViewStyle;
  useTopInset?: boolean;
};

export default function DetailHeader({
  title,
  showBackButton = true,
  rightElement,
  onPressBack,
  containerStyle,
  useTopInset = false,
}: DetailHeaderProps) {
  const navigation = useNavigation();

  const handleBackPress = React.useCallback(() => {
    if (onPressBack) {
      onPressBack();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation, onPressBack]);

  const headerContent = (
    <View style={[styles.header, containerStyle]}>
      <View style={styles.side}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기">
            <BackIcon width={18} height={18} />
          </TouchableOpacity>
        ) : null}
      </View>

      {title ? (
        <Text
          variant="headlineM"
          color="#111827"
          align="center"
          style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.titlePlaceholder} />
      )}

      <View style={[styles.side, styles.right]}>{rightElement}</View>
    </View>
  );

  if (useTopInset) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {headerContent}
      </SafeAreaView>
    );
  }

  return headerContent;
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 44,
    height: '100%',
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  titlePlaceholder: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
});
