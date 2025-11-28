import {apiClient} from './client';

export interface CommunityPostAuthor {
  id: number;
  name: string;
}

export interface CommunityPost {
  id: number;
  imageUrl: string | null;
  author: CommunityPostAuthor;
  createdAt: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  keyword: string;
  isLiked: boolean;
}

export interface CommunityPostsResponse {
  limit: number;
  nextCursor: string | null;
  hasNext: boolean;
  posts: CommunityPost[];
}

export interface GetCommunityPostsParams {
  cursor?: number | null;
  limit?: number;
  keyword?: string | null;
}

export async function getCommunityPosts(
  params: GetCommunityPostsParams = {},
): Promise<CommunityPostsResponse> {
  const {cursor, limit, keyword} = params;

  // 값이 있을 때만 파라미터에 포함
  const queryParams: Record<string, string | number> = {};

  if (limit !== undefined && limit !== null) {
    queryParams.limit = limit;
  }

  if (cursor !== undefined && cursor !== null) {
    queryParams.cursor = cursor;
  }

  if (keyword !== undefined && keyword !== null && keyword !== '') {
    queryParams.keyword = keyword;
  }

  const response = await apiClient.get<CommunityPostsResponse>(
    '/community/posts',
    {params: queryParams},
  );

  return response.data;
}

export interface UploadImageResponse {
  imageName: string;
  imageUrl: string;
}

export async function uploadCommunityImage(
  imageUri: string,
): Promise<UploadImageResponse> {
  const formData = new FormData();

  // React Native에서 이미지 파일을 FormData에 추가
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'image.jpg',
  } as any);

  const response = await apiClient.post<UploadImageResponse>(
    '/community/posts/images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  keyword: string;
  imageUrls: string[];
}

export async function createCommunityPost(
  data: CreatePostRequest,
): Promise<void> {
  await apiClient.post('/community/posts', data);
}

export interface CommunityPostDetail {
  id: number;
  imageUrl: string | null;
  author: CommunityPostAuthor;
  createdAt: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  keyword: string;
  isMine: boolean;
  isLiked: boolean;
}

export async function getCommunityPostDetail(
  postId: string,
): Promise<CommunityPostDetail> {
  const response = await apiClient.get<CommunityPostDetail>(
    `/community/posts/${postId}`,
  );

  return response.data;
}

export interface ToggleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

export async function toggleCommunityPostLike(
  postId: string,
): Promise<ToggleLikeResponse> {
  const response = await apiClient.post<ToggleLikeResponse>(
    `/community/posts/${postId}/likes`,
  );

  return response.data;
}

export interface CommentAuthor {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  author: CommentAuthor;
  createdAt: string;
  content: string;
  isMine: boolean;
}

export interface CommentsResponse {
  limit: number;
  nextCursor: string | null;
  hasNext: boolean;
  comments: Comment[];
}

export interface GetCommentsParams {
  cursor?: number | null;
  limit?: number;
}

export async function getPostComments(
  postId: string,
  params: GetCommentsParams = {},
): Promise<CommentsResponse> {
  const {cursor, limit} = params;

  const queryParams: Record<string, string | number> = {};

  if (limit !== undefined && limit !== null) {
    queryParams.limit = limit;
  }

  if (cursor !== undefined && cursor !== null) {
    queryParams.cursor = cursor;
  }

  const response = await apiClient.get<CommentsResponse>(
    `/community/posts/${postId}/comments`,
    {params: queryParams},
  );

  return response.data;
}

export interface CreateCommentRequest {
  content: string;
}

export async function createPostComment(
  postId: string,
  data: CreateCommentRequest,
): Promise<void> {
  await apiClient.post(`/community/posts/${postId}/comments`, data);
}

export async function deletePostComment(
  postId: string,
  commentId: number,
): Promise<void> {
  await apiClient.delete(`/community/posts/${postId}/comments/${commentId}`);
}

export async function deleteCommunityPost(postId: string): Promise<void> {
  await apiClient.delete(`/community/posts/${postId}`);
}

export interface ReportPostRequest {
  postId: number;
  reason: string;
}

export async function reportCommunityPost(
  postId: string,
  reason: string,
): Promise<void> {
  const requestBody: ReportPostRequest = {
    postId: parseInt(postId, 10),
    reason,
  };

  await apiClient.post(`/community/reports`, requestBody);
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  keyword: string;
  imageUrls: string[];
}

export async function updateCommunityPost(
  postId: string,
  data: UpdatePostRequest,
): Promise<void> {
  await apiClient.put(`/community/posts/${postId}`, data);
}

interface PostKeywordsResponse {
  keywords: string[];
}

export async function getPostKeywords(): Promise<string[]> {
  const response = await apiClient.get<PostKeywordsResponse>(
    '/community/posts/keywords',
  );
  return response.data?.keywords ?? [];
}

export interface GetUserPostsParams {
  cursor?: number | null;
  limit?: number;
}

export async function getMyPosts(
  params: GetUserPostsParams = {},
): Promise<CommunityPostsResponse> {
  const {cursor, limit} = params;

  const queryParams: Record<string, string | number> = {};

  if (limit !== undefined && limit !== null) {
    queryParams.limit = limit;
  }

  if (cursor !== undefined && cursor !== null) {
    queryParams.cursor = cursor;
  }

  const response = await apiClient.get<CommunityPostsResponse>('/users/posts', {
    params: queryParams,
  });

  return response.data;
}

export async function getMyComments(
  params: GetUserPostsParams = {},
): Promise<CommunityPostsResponse> {
  const {cursor, limit} = params;

  const queryParams: Record<string, string | number> = {};

  if (limit !== undefined && limit !== null) {
    queryParams.limit = limit;
  }

  if (cursor !== undefined && cursor !== null) {
    queryParams.cursor = cursor;
  }

  const response = await apiClient.get<CommunityPostsResponse>(
    '/users/comments',
    {params: queryParams},
  );

  return response.data;
}
