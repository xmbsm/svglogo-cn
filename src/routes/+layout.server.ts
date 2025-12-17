import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ url: { pathname }, fetch }) => {
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();
    return { pathname, stars: data.stars || '0' };
  } catch (error) {
    console.error('Failed to fetch stars:', error);
    return { pathname, stars: '0' };
  }
};
