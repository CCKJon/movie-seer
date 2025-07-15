// Import necessary modules
//@ts-nocheck
import { json } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';

// Modified function to parse movie titles
function parseMovieData(html: string) {
  const { document } = parseHTML(html);
  let titles = [];
  let releasedates = [];
  let movieposters = [];
  
  // Try multiple selectors for titles
  const titleSelectors = [
    '.p--small[data-qa="discovery-media-list-item-title"]',
    '[data-qa="discovery-media-list-item-title"]',
    '.discovery-media-list-item-title',
    '.movie-title'
  ];
  
  // Try multiple selectors for release dates
  const dateSelectors = [
    '.smaller[data-qa="discovery-media-list-item-start-date"]',
    '[data-qa="discovery-media-list-item-start-date"]',
    '.discovery-media-list-item-start-date',
    '.release-date'
  ];
  
  // Try multiple selectors for posters
  const posterSelectors = [
    '.js-tile-link .posterImage',
    '.posterImage',
    '.movie-poster img',
    'img[src*="poster"]',
    '.js-tile-link img[src*=".jpg"]',
    '.js-tile-link img[src*=".jpeg"]',
    '.js-tile-link img[src*=".png"]',
    'img[src*=".jpg"]',
    'img[src*=".jpeg"]',
    'img[src*=".png"]'
  ];

  // Find titles
  for (const selector of titleSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach((element) => {
        const title = element.textContent.trim();
        if (title) titles.push(title);
      });
      break;
    }
  }

  // Find release dates
  for (const selector of dateSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach((element) => {
        const releasedate = element.textContent.trim();
        if (releasedate) releasedates.push(releasedate);
      });
      break;
    }
  }

  // Find posters
  for (const selector of posterSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach((element) => {
        const posterSrc = element.getAttribute('src');
        if (posterSrc) {
          // Ensure the URL is complete (has protocol)
          let fullUrl = posterSrc;
          if (posterSrc.startsWith('//')) {
            fullUrl = 'https:' + posterSrc;
          } else if (posterSrc.startsWith('/')) {
            fullUrl = 'https://www.rottentomatoes.com' + posterSrc;
          }
          
          console.log('Found poster URL:', fullUrl);
          movieposters.push(fullUrl);
        }
      });
      break;
    }
  }

  // Ensure all arrays have the same length
  const maxLength = Math.max(titles.length, releasedates.length, movieposters.length);
  
  // Pad arrays with empty values if needed
  while (titles.length < maxLength) titles.push('');
  while (releasedates.length < maxLength) releasedates.push('');
  while (movieposters.length < maxLength) movieposters.push('');

  let streamablemovies = titles.map((item, index) => ({
    title: item,
    streaming_date: releasedates[index] || '',
    postersrc: movieposters[index] || '',
  })).filter(movie => movie.title); // Only include movies with titles

  console.log("streamable movies", streamablemovies)
  return streamablemovies;
}

async function getMovieData(number) {
  const URL = `https://www.rottentomatoes.com/browse/movies_at_home/sort:newest?page=${number}`
  
  try {
    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching from Rotten Tomatoes:', error);
    throw error;
  }
}

export const POST = async ({ request }) => {
  try {
    const number = await request.json();
    console.log("this is my number", number)
    const html = await getMovieData(number);
    
    // Debug: Log a sample of the HTML to understand structure
    console.log("HTML sample:", html.substring(0, 1000));
    
    let movieData = parseMovieData(html)

    return json(movieData);
  } catch (error) {
    console.error('Error in streaming API:', error);
    return json({ error: 'Failed to fetch streaming data' }, { status: 500 });
  }
}








