// Import necessary modules
//@ts-nocheck
import { json } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';

function parseTheaterMovieData(html: string) {
  const { document } = parseHTML(html);
  let theatertitles = [];
  let theaterreleasedates = [];
  let theatermovieposters = [];

  // Try multiple selectors for titles
  const titleSelectors = [
    '.js-tile-link [data-qa="discovery-media-list-item-title"]',
    '[data-qa="discovery-media-list-item-title"]',
    '.discovery-media-list-item-title',
    '.movie-title'
  ];
  
  // Try multiple selectors for release dates
  const dateSelectors = [
    '.js-tile-link [data-qa="discovery-media-list-item-start-date"]',
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
        if (title) theatertitles.push(title);
      });
      break;
    }
  }

  // Find release dates
  for (const selector of dateSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach((element) => {
        const theaterreleasedate = element.textContent.trim();
        if (theaterreleasedate) theaterreleasedates.push(theaterreleasedate);
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
          
          console.log('Found theater poster URL:', fullUrl);
          theatermovieposters.push(fullUrl);
        }
      });
      break;
    }
  }

  // Ensure all arrays have the same length
  const maxLength = Math.max(theatertitles.length, theaterreleasedates.length, theatermovieposters.length);
  
  // Pad arrays with empty values if needed
  while (theatertitles.length < maxLength) theatertitles.push('');
  while (theaterreleasedates.length < maxLength) theaterreleasedates.push('');
  while (theatermovieposters.length < maxLength) theatermovieposters.push('');

  let theatermovies = theatertitles.map((item, index) => ({
    title: item,
    theater_date: theaterreleasedates[index] || '',
    postersrc: theatermovieposters[index] || '',
  })).filter(movie => movie.title); // Only include movies with titles

  console.log("theater movies", theatermovies)
  return theatermovies;
}

async function getTheaterMovieData(number) {
  const URL = `https://www.rottentomatoes.com/browse/movies_coming_soon/?page=${number}`
  
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
    const theaternumber = await request.json();
    console.log("this is my theater number", theaternumber)
    const html = await getTheaterMovieData(theaternumber);
    let theatermovieData = parseTheaterMovieData(html)

    return json(theatermovieData);
  } catch (error) {
    console.error('Error in theater API:', error);
    return json({ error: 'Failed to fetch theater data' }, { status: 500 });
  }
}



