// Import necessary modules
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request }: RequestEvent) => {
  try {
    // For now, return empty array since bluray scraping is not implemented
    // This can be extended later when bluray data is available
    return json([]);
  } catch (error) {
    console.error('Error in bluray API:', error);
    return json({ error: 'Failed to fetch bluray data' }, { status: 500 });
  }
}
