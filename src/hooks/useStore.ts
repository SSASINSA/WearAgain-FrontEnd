import {useInfiniteQuery, useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  storeApi,
  StoreItemListParams,
  StoreItemListResult,
  StoreItemResponse,
  StoreItemDetailResponse,
  CreateStoreOrderRequest,
  StoreOrderListParams,
  StoreOrderListResult,
} from '../api/storeApi';

export type StoreItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  thumbnailUrl?: string;
};

export type StoreItemDetail = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  maxPurchasePerUser: number;
  status: string;
  imageUrl?: string;
  images: {
    id: number;
    url: string;
    sortOrder: number;
  }[];
  pickupLocations: string[];
};

function toStoreItem(item: StoreItemResponse): StoreItem {
  return {
    id: String(item.id),
    name: item.name,
    category: item.category,
    price: item.price,
    thumbnailUrl: item.thumbnailUrl,
  };
}

function toStoreItemDetail(payload: StoreItemDetailResponse): StoreItemDetail {
  const sortedImages = [...payload.images].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const mainImage = sortedImages[0];

  return {
    id: String(payload.id),
    name: payload.name,
    description: payload.description,
    category: payload.category,
    price: payload.price,
    stock: payload.stock,
    maxPurchasePerUser: payload.maxPurchasePerUser,
    status: payload.status,
    imageUrl: mainImage?.imageUrl,
    images: payload.images.map(img => ({
      id: img.id,
      url: img.imageUrl,
      sortOrder: img.sortOrder,
    })),
    pickupLocations: payload.pickupLocations,
  };
}

type StoreItemsListParams = Omit<StoreItemListParams, 'cursor'>;

export function useStoreItemsList(params?: StoreItemsListParams) {
  return useInfiniteQuery({
    queryKey: ['store', 'items', params],
    queryFn: ({pageParam}) =>
      storeApi.getItems({
        ...params,
        cursor: typeof pageParam === 'string' ? pageParam : undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: StoreItemListResult) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
    select: data => ({
      ...data,
      pages: data.pages.map(page => ({
        ...page,
        items: page.items.map(toStoreItem),
      })),
    }),
  });
}

export function useStoreItemDetail(itemId: string | undefined) {
  return useQuery({
    queryKey: ['store', 'item', itemId],
    queryFn: async () => {
      if (!itemId) {
        throw new Error('itemId is required');
      }
      const detail = await storeApi.getItemDetail(itemId);
      return toStoreItemDetail(detail);
    },
    enabled: !!itemId,
  });
}

export function useCreateStoreOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateStoreOrderRequest) =>
      storeApi.createOrder(body),
    onSuccess: () => {
      // 주문이 완료되면 유저 크레딧 요약 정보를 다시 가져와 상단 크레딧을 갱신
      queryClient.invalidateQueries({queryKey: ['user', 'summary']});
      // 주문 목록도 갱신
      queryClient.invalidateQueries({queryKey: ['store', 'orders']});
    },
  });
}

type StoreOrdersListParams = Omit<StoreOrderListParams, 'cursor'>;

export function useStoreOrdersList(params?: StoreOrdersListParams) {
  return useInfiniteQuery({
    queryKey: ['store', 'orders', params],
    queryFn: ({pageParam}) =>
      storeApi.getOrders({
        ...params,
        cursor: typeof pageParam === 'string' ? pageParam : undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: StoreOrderListResult) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}

