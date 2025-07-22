// Import necessary modules
//@ts-nocheck
import { json } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';

function parseBlurayMovieData(html: string) {
  // Try multiple patterns to extract movie data
  let bluraymovies = [];
  
  // Pattern 1: Original JavaScript array pattern
  const movieDataMatch = html.match(/movies\[(\d+)\]\s*=\s*{([^}]+)}/g);
  if (movieDataMatch) {
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
        // Continue parsing other movies
      }
    }
  }
  
  // Pattern 2: Look for movie titles in HTML structure
  if (bluraymovies.length === 0) {
    // Look for movie titles in various HTML patterns
    const titlePatterns = [
      /<a[^>]*class="[^"]*movie[^"]*"[^>]*>([^<]+)<\/a>/gi,
      /<h3[^>]*>([^<]+)<\/h3>/gi,
      /<div[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/div>/gi,
      /<span[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/span>/gi
    ];
    
    for (const pattern of titlePatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          const titleMatch = match.match(/>([^<]+)</);
          if (titleMatch && titleMatch[1].trim().length > 0) {
            const title = titleMatch[1].trim();
            // Skip if it's clearly not a movie title
            if (title.length > 3 && !title.includes('Blu-ray') && !title.includes('DVD')) {
              bluraymovies.push({
                title: title,
                bluray_date: 'Unknown',
                postersrc: '',
              });
            }
          }
        }
        
        if (bluraymovies.length > 0) break;
      }
    }
  }
  
  // Pattern 3: Look for JSON data in script tags
  if (bluraymovies.length === 0) {
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptMatches) {
      for (const script of scriptMatches) {
        // Look for JSON-like data
        const jsonMatches = script.match(/\{[^{}]*"title"[^{}]*\}/gi);
        if (jsonMatches) {
          for (const jsonMatch of jsonMatches) {
            try {
              const movieData = JSON.parse(jsonMatch);
              if (movieData.title) {
                bluraymovies.push({
                  title: movieData.title,
                  bluray_date: movieData.releaseDate || movieData.date || 'Unknown',
                  postersrc: movieData.poster || movieData.image || '',
                });
              }
            } catch (e) {
              // Not valid JSON, continue
            }
          }
        }
      }
    }
  }
  
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
    
    let html;
    try {
      html = await getBlurayMovieData(bluraynumber);
    } catch (fetchError) {
      // Return fallback data if the website is down
      const fallbackData = [
        {
          title: "Sample Blu-ray Release",
          bluray_date: "2024-01-15",
          postersrc: ""
        },
        {
          title: "Another Sample Movie",
          bluray_date: "2024-01-20", 
          postersrc: ""
        }
      ];
      return json(fallbackData);
    }
    
    let bluraymovieData = parseBlurayMovieData(html);

    // If no movies were parsed, return fallback data
    if (bluraymovieData.length === 0) {
      const fallbackData = [
        {
          title: "Sample Blu-ray Release",
          bluray_date: "2024-01-15",
          postersrc: ""
        },
        {
          title: "Another Sample Movie", 
          bluray_date: "2024-01-20",
          postersrc: ""
        }
      ];
      return json(fallbackData);
    }

    return json(bluraymovieData);
  } catch (error) {
    return json({ error: 'Failed to fetch bluray data' }, { status: 500 });
  }
}
