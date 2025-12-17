import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 缓存 GitHub stars 数据，避免频繁请求
let cachedStars: string | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export const GET: RequestHandler = async () => {
  const now = Date.now();
  
  // 如果缓存有效，直接返回
  if (cachedStars && (now - lastFetch) < CACHE_DURATION) {
    return json({ stars: cachedStars });
  }

  try {
    const res = await fetch('https://api.github.com/repos/pheralb/svgl');
    const response = await res.json();
    
    const starsFormated = response.stargazers_count > 1000
      ? `${(response.stargazers_count / 1000).toFixed(1)}K`
      : response.stargazers_count;
    
    cachedStars = starsFormated;
    lastFetch = now;
    
    return json({ stars: starsFormated });
  } catch (error) {
    // 如果有缓存数据，返回缓存
    if (cachedStars) {
      return json({ stars: cachedStars });
    }
    
    return json({ error: 'Failed to fetch stars' }, { status: 500 });
  }
};