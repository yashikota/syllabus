import type { Courses } from "~/types/syllabus";

const CACHE_PREFIX = "syllabus_cache_";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 Week

interface CacheData {
  data: Courses;
  timestamp: number;
}

export const syllabusCache = {
  get: (key: string): Courses | null => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached) as CacheData;
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  },

  set: (key: string, data: Courses): void => {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (e) {
      console.error("Cache storage failed:", e);
    }
  },
};
