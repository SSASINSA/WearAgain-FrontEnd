export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  images?: string[];
  brand: string;
  category: string;
  subcategory?: string;
  size: string;
  color?: string;
  material?: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  tags?: string[];
  isAvailable: boolean;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  likeCount?: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  size?: string;
  color?: string;
  sortBy?: 'price' | 'createdAt' | 'popularity' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductFilter {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  conditions: string[];
  sizes: string[];
  colors: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}
