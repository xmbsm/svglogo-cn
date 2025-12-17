import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 缓存访客数据
let cachedVisitorCount: string | null = null;
let lastVisitorFetch = 0;
const VISITOR_CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存

export const GET: RequestHandler = async () => {
  const now = Date.now();
  
  // 如果缓存有效，直接返回
  if (cachedVisitorCount && (now - lastVisitorFetch) < VISITOR_CACHE_DURATION) {
    return json({ count: cachedVisitorCount });
  }

  try {
    const response = await fetch("https://v6-widget.51.la/v6/Kdb6i5hQGkAkkUoZ/quote.js");
    const data = await response.text();
    const num = data.match(/(?<=<\/span><span>).*?(?=<\/span><\/p>)/g);
    
    if (num && num[6]) {
      cachedVisitorCount = (parseInt(num[6], 10) + 7500).toString();
      lastVisitorFetch = now;
      return json({ count: cachedVisitorCount });
    }
    
    return json({ error: 'No visitor data found' }, { status: 404 });
  } catch (error) {
    // 如果有缓存数据，返回缓存
    if (cachedVisitorCount) {
      return json({ count: cachedVisitorCount });
    }
    
    return json({ error: 'Failed to fetch visitor count' }, { status: 500 });
  }
};