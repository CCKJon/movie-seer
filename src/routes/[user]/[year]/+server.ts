import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';
import cheerio from 'cheerio';

export const get: RequestHandler = async (request) => {
  try {
    // Make a request to the website you want to scrape
    const response = await axios.get('https://example.com/upcoming-movies');

    // Parse HTML content using Cheerio
    const $ = cheerio.load(response.data);

    // Extract titles
    const titles = [];
    $('.movie-title-selector').each((index, element) => {
      const title = $(element).text().trim();
      titles.push(title);
    });

    // Return the titles as JSON
    return {
      body: { titles },
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      status: 500,
      body: { error: 'Internal Server Error' },
    };
  }
};
