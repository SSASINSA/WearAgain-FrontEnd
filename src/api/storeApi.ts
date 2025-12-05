import {apiClient} from './client';

export type StoreItemResponse = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  maxPurchasePerUser: number;
  status: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type StoreItemListResult = {
  items: StoreItemResponse[];
  nextCursor?: string | null;
  hasNext: boolean;
};

export type StoreItemListParams = {
  category?: string;
  keyword?: string;
  cursor?: string;
  size?: number;
};

// 단일 상품 상세 응답 타입 (/api/v1/store/items/{itemId})
export type StoreItemImageResponse = {
  id: number;
  imageUrl: string;
  sortOrder: number;
};

export type StoreItemDetailResponse = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  maxPurchasePerUser: number;
  status: string;
  images: StoreItemImageResponse[];
  pickupLocations: string[];
  createdAt: string;
  updatedAt: string;
};

// 주문 생성 요청 (/api/v1/store/orders)
export type CreateStoreOrderRequest = {
  itemId: number;
  quantity: number;
  pickupLocation: string;
};

// 주문 생성 응답 (필요한 필드만 정의, 사용 안 하면 any처럼 동작)
export type CreateStoreOrderResponse = {
  orderId: number;
  itemId: number;
  quantity: number;
  pickupLocation: string;
  createdAt: string;
};

// 주문 목록 조회 파라미터
export type StoreOrderListParams = {
  cursor?: string;
  size?: number;
  status?: string;
};

// 주문 목록 응답
export type StoreOrderResponse = {
  orderId: number;
  userEmail: string;
  itemId: number;
  itemName: string;
  itemThumbnailUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  pickupLocation: string;
  status: string;
  purchasedAt: string;
  canceledAt: string | null;
};

export type StoreOrderListResult = {
  orders: StoreOrderResponse[];
  nextCursor: string | null;
  hasNext: boolean;
};

const BASE_PATH = '/store/items';
const ORDER_BASE_PATH = '/store/orders';

export const storeApi = {
  async getItems(params: StoreItemListParams = {}) {
    const {data} = await apiClient.get<StoreItemListResult>(BASE_PATH, {
      params,
    });
    return data;
  },

  // /api/v1/store/items/{itemId}
  async getItemDetail(itemId: string | number) {
    const {data} = await apiClient.get<StoreItemDetailResponse>(
      `${BASE_PATH}/${itemId}`,
    );
    return data;
  },

  // /api/v1/store/orders
  async createOrder(body: CreateStoreOrderRequest) {
    const {data} = await apiClient.post<CreateStoreOrderResponse>(
      ORDER_BASE_PATH,
      body,
    );
    return data;
  },

  // /api/v1/store/orders - 주문 목록 조회
  async getOrders(params: StoreOrderListParams = {}) {
    const {data} = await apiClient.get<StoreOrderListResult>(ORDER_BASE_PATH, {
      params,
    });
    return data;
  },
};


