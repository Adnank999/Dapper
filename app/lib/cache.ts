// app/lib/cache.ts
interface CacheItem {
  value: any;
  expiry: number; // Timestamp in milliseconds
}

class Cache {
  private cache: Record<string, CacheItem> = {};

  set(key: string, value: any, ttl: number) {
    const expiry = Date.now() + ttl * 1000; // Convert seconds to milliseconds
    this.cache[key] = { value, expiry };
  }

  get<T>(key: string): T | null {
    const item = this.cache[key];
    if (!item) return null;

    // Check if the item is expired
    if (Date.now() > item.expiry) {
      delete this.cache[key]; // Remove expired item
      return null;
    }

    return item.value as T;
  }

  del(key: string) {
    delete this.cache[key];
  }
}

const cache = new Cache();
export default cache;
