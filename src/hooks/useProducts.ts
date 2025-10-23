import {useQuery} from '@tanstack/react-query';
import {productApi} from '../api/productApi';
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productApi.getProducts,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProduct(productId),
    enabled: !!productId,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productApi.searchProducts(query),
    enabled: !!query && query.length > 2,
  });
}
