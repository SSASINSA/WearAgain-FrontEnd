import {apiClient} from './client';
import {
  Product,
  ProductListResponse,
  ProductSearchParams,
} from '../types/product';

export const productApi = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductListResponse> {
    const response = await apiClient.get('/products', {params});
    return response.data;
  },

  async getProduct(productId: string): Promise<Product> {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },

  async searchProducts(
    query: string,
    params?: ProductSearchParams,
  ): Promise<ProductListResponse> {
    const response = await apiClient.get('/products/search', {
      params: {
        q: query,
        ...params,
      },
    });
    return response.data;
  },

  async getProductsByCategory(
    categoryId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
  ): Promise<ProductListResponse> {
    const response = await apiClient.get(`/categories/${categoryId}/products`, {
      params,
    });
    return response.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await apiClient.get('/products/featured');
    return response.data;
  },

  async getRecommendedProducts(userId?: string): Promise<Product[]> {
    const response = await apiClient.get('/products/recommended', {
      params: userId ? {userId} : {},
    });
    return response.data;
  },
};
