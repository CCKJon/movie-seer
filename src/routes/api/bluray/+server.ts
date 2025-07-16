// Import necessary modules
//@ts-nocheck
import { json } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';

function parseBlurayMovieData(html: string) {
  // Extract movie data from JavaScript array in the HTML
  const movieDataMatch = html.match(/movies\[(\d+)\]\s*=\s*{([^}]+)}/g);
  
  if (!movieDataMatch) {
    console.log('No movie data found in JavaScript array');
    return [];
  }

  const bluraymovies = [];
  
  for (const match of movieDataMatch) {
    try {
      // Extract the properties from the movie object
      const titleMatch = match.match(/title:\s*'([^']+)'/);
      const releaseDateMatch = match.match(/releasedate:\s*'([^']+)'/);
      const idMatch = match.match(/id:\s*(\d+)/);
      
      if (titleMatch && releaseDateMatch) {
        const title = titleMatch[1];
        const releaseDate = releaseDateMatch[1];
        const id = idMatch ? idMatch[1] : '';
        
        // Construct poster URL using the movie ID
        const posterUrl = id ? `https://images.static-bluray.com/movies/covers/${id}_large.jpg` : '';
        
        bluraymovies.push({
          title: title,
          bluray_date: releaseDate,
          postersrc: posterUrl,
        });
      }
    } catch (error) {
      console.error('Error parsing movie data:', error);
    }
  }

  console.log("bluray movies", bluraymovies);
  return bluraymovies;
}

async function getBlurayMovieData(number) {
  const URL = `https://www.blu-ray.com/movies/releasedates.php?4k=1&page=${number}`
  
  try {
    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching from Blu-ray.com:', error);
    throw error;
  }
}

export const POST = async ({ request }) => {
  try {
    const bluraynumber = await request.json();
    console.log("Bluray API - Requested page:", bluraynumber);
    const html = await getBlurayMovieData(bluraynumber);
    
    // Debug: Log a sample of the HTML to understand structure
    console.log("Bluray API - HTML sample:", html.substring(0, 1000));
    
    let bluraymovieData = parseBlurayMovieData(html);
    console.log("Bluray API - Parsed movies count:", bluraymovieData.length);
    console.log("Bluray API - First few movie titles:", bluraymovieData.slice(0, 3).map(m => m.title));

    return json(bluraymovieData);
  } catch (error) {
    console.error('Error in bluray API:', error);
    return json({ error: 'Failed to fetch bluray data' }, { status: 500 });
  }
}
