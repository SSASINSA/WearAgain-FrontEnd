import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BackIcon from '../../assets/icons/back.svg';
import { useNavigation } from '@react-navigation/native';


export default function DetailHeader({}) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <BackIcon width={15.75} height={18} />
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
    header: {
        height: 55,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        justifyContent: 'center',
        paddingHorizontal: 16,
      },
      backButton: {
        width: 31.75,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      },
});