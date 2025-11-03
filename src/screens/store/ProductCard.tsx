import React, {memo} from 'react';
import {View, Pressable, ImageSourcePropType, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../../components/common/Text';

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    image: ImageSourcePropType;
  };
}

function ProductCardBase({product}: Props) {
  const navigation = useNavigation<any>();

  return (
    <Pressable
      onPress={() => navigation.navigate('ProductDetail', {productId: product.id})}
      style={styles.card}
    >
      <View style={styles.imagePlaceholder}>
        <Text variant="bodyM" color="#FFFFFF" align="center">
          {String(product.image)}
        </Text>
      </View>
      <View style={styles.infoArea}>
        <Text variant="bodyM" color="#111827" numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text variant="bodyM" color="#06b0b7" style={styles.coinLabel}>
            C
          </Text>
          <Text variant="bodyM" color="#06b0b7">{product.price}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    width: 180.5,
    height: 231.5,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 162.5,
    backgroundColor: '#E5E7EB',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoArea: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  priceRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinLabel: {
    marginRight: 2,
  },
});
const ProductCard = memo(ProductCardBase);
export default ProductCard;


