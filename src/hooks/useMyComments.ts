import {useState, useCallback, useEffect} from 'react';
import {
  getMyComments,
  CommunityPost,
  GetUserPostsParams,
} from '../api/communityApi';

interface UseMyCommentsOptions {
  limit?: number;
  enabled?: boolean;
}

export function useMyComments(options: UseMyCommentsOptions = {}) {
  const {limit = 10, enabled = true} = options;

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(
    async (cursor: number | null = null, append: boolean = false) => {
      if (!enabled) return;

      try {
        if (!append) {
          setIsLoading(true);
        }
        setError(null);

        const params: GetUserPostsParams = {
          cursor,
          limit,
        };

        const response = await getMyComments(params);

        if (append) {
          setPosts(prev => [...prev, ...response.posts]);
        } else {
          setPosts(response.posts);
        }

        setNextCursor(
          response.nextCursor ? parseInt(response.nextCursor, 10) : null,
        );
        setHasNext(response.hasNext);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Failed to fetch my comments:', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [enabled, limit],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasNext && nextCursor !== null) {
      fetchPosts(nextCursor, true);
    }
  }, [isLoading, hasNext, nextCursor, fetchPosts]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPosts(null, false);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(null, false);
  }, [fetchPosts]);

  const updatePost = useCallback((postId: string, updates: Partial<CommunityPost>) => {
    setPosts(prev =>
      prev.map(post =>
        post.id.toString() === postId ? {...post, ...updates} : post,
      ),
    );
  }, []);

  return {
    posts,
    isLoading,
    isRefreshing,
    hasNext,
    error,
    loadMore,
    refresh,
    updatePost,
  };
}

