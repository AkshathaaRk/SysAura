/**
 * API Cache Service
 * 
 * This service provides caching for API requests to reduce redundant network calls
 * and CPU usage during data fetching operations.
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  forceRefresh?: boolean; // Force refresh the cache
}

class ApiCacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 60000; // Default cache TTL: 60 seconds
  private pendingRequests: Map<string, Promise<any>> = new Map();

  /**
   * Get data from cache or fetch it if not available
   */
  async getCachedData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const { ttl = this.defaultTTL, forceRefresh = false } = options;
    const now = Date.now();

    // Check if we already have a valid cached item
    if (!forceRefresh && this.cache.has(key)) {
      const cachedItem = this.cache.get(key)!;
      
      // Return cached data if it's still valid
      if (cachedItem.expiresAt > now) {
        console.log(`[Cache] Using cached data for: ${key}`);
        return cachedItem.data;
      }
    }

    // Check if there's already a pending request for this key
    if (this.pendingRequests.has(key)) {
      console.log(`[Cache] Using pending request for: ${key}`);
      return this.pendingRequests.get(key)!;
    }

    // Fetch fresh data
    console.log(`[Cache] Fetching fresh data for: ${key}`);
    const fetchPromise = fetchFn().then(data => {
      // Store in cache
      this.cache.set(key, {
        data,
        timestamp: now,
        expiresAt: now + ttl
      });
      
      // Remove from pending requests
      this.pendingRequests.delete(key);
      
      return data;
    }).catch(error => {
      // Remove from pending requests on error
      this.pendingRequests.delete(key);
      throw error;
    });

    // Store the pending request
    this.pendingRequests.set(key, fetchPromise);
    
    return fetchPromise;
  }

  /**
   * Clear a specific cache item
   */
  clearCache(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }

  /**
   * Set the default TTL for cache items
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}

// Create a singleton instance
const apiCacheService = new ApiCacheService();

export default apiCacheService;
