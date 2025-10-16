import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Text} from '../components/common/Text';

export default function PlaceholderScreen() {
  const route = useRoute<any>();
  return (
    <View style={styles.container}>
      <Text variant="labelL" color="red">
        {route.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
