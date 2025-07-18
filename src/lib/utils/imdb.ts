// Utility function to get IMDB movie URL
export async function getImdbUrl(movieTitle: string): Promise<string> {
  try {
    // Add a small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Use TMDB API to get IMDb ID
    const tmdbApiKey = '8c247ea0b4b56ed2ff7d41c9a833aa77'; // Free public API key
    
    // Clean the movie title for better matching
    const cleanTitle = movieTitle
      .replace(/\([^)]*\)/g, '') // Remove parentheses and their contents
      .replace(/\[[^\]]*\]/g, '') // Remove brackets and their contents
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\b(4K|Blu-ray|Ultra HD|UHD|HD|DVD)\b/gi, '') // Remove format indicators
      .replace(/\b(Collector's Edition|Special Edition|Limited Edition|Director's Cut|Extended Cut)\b/gi, '') // Remove edition indicators
      .replace(/\b(Digital|Streaming|VOD|Video on Demand)\b/gi, '') // Remove digital indicators
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space again
      .trim();
    
    console.log(`Searching for IMDb URL: "${movieTitle}" -> "${cleanTitle}"`);
    
    // If the title was significantly cleaned, log it
    if (cleanTitle !== movieTitle && cleanTitle.length < movieTitle.length) {
      console.log(`Title cleaned from "${movieTitle}" to "${cleanTitle}"`);
    }
    
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(cleanTitle)}&language=en-US&page=1&include_adult=false`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Movie-Seer/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`TMDB search for "${cleanTitle}" returned ${data.results?.length || 0} results`);
    if (data.results && data.results.length > 0) {
      console.log(`Top 3 TMDB results:`, data.results.slice(0, 3).map((r: any) => r.title));
    }
    
    if (data.results && data.results.length > 0) {
      // Try to find the best match by comparing titles
      let bestMatch = data.results[0];
      let bestScore = 0;
      
      for (const movie of data.results.slice(0, 5)) { // Check first 5 results
        const tmdbTitle = movie.title.toLowerCase();
        const searchTitle = cleanTitle.toLowerCase();
        
        // Calculate similarity score
        let score = 0;
        if (tmdbTitle === searchTitle) {
          score = 100;
        } else if (tmdbTitle.includes(searchTitle) || searchTitle.includes(tmdbTitle)) {
          score = 80;
        } else {
          // Simple word matching
          const searchWords = searchTitle.split(' ');
          const tmdbWords = tmdbTitle.split(' ');
          const matchingWords = searchWords.filter(word => 
            tmdbWords.some((tmdbWord: string) => tmdbWord.includes(word) || word.includes(tmdbWord))
          );
          score = (matchingWords.length / searchWords.length) * 60;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = movie;
        }
      }
      
      // Only proceed if we have a reasonable match (score > 30)
      if (bestScore > 30) {
        // Get the movie details to get the IMDb ID
        const detailsUrl = `https://api.themoviedb.org/3/movie/${bestMatch.id}?api_key=${tmdbApiKey}&append_to_response=external_ids`;
        const detailsResponse = await fetch(detailsUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Movie-Seer/1.0'
          }
        });
        
        if (detailsResponse.ok) {
          const details = await detailsResponse.json();
          
          if (details.external_ids && details.external_ids.imdb_id) {
            // Construct the proper IMDb URL
            const imdbUrl = `https://www.imdb.com/title/${details.external_ids.imdb_id}/`;
            console.log(`Found IMDb URL for "${movieTitle}": ${imdbUrl}`);
            return imdbUrl;
          }
        }
      }
    }
    
    // If no good match found, try with the original title as fallback
    if (cleanTitle !== movieTitle) {
      const fallbackSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(movieTitle)}&language=en-US&page=1&include_adult=false`;
      
      const fallbackResponse = await fetch(fallbackSearchUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Movie-Seer/1.0'
        }
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.results && fallbackData.results.length > 0) {
          const movie = fallbackData.results[0];
          
          const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}&append_to_response=external_ids`;
          const detailsResponse = await fetch(detailsUrl, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Movie-Seer/1.0'
            }
          });
          
          if (detailsResponse.ok) {
            const details = await detailsResponse.json();
            
            if (details.external_ids && details.external_ids.imdb_id) {
              const imdbUrl = `https://www.imdb.com/title/${details.external_ids.imdb_id}/`;
              console.log(`Found IMDb URL for "${movieTitle}" (fallback): ${imdbUrl}`);
              return imdbUrl;
            }
          }
        }
      }
    }
    
    // Fallback to search URL if no IMDb ID found
    console.log(`No IMDb ID found for "${movieTitle}", using search URL`);
    return `https://www.imdb.com/find/?q=${encodeURIComponent(movieTitle)}&s=tt&ttype=ft&ref_=fn_ft`;
  } catch (error) {
    console.error('Error getting IMDB URL for:', movieTitle, error);
    // Fallback to search URL
    return `https://www.imdb.com/find/?q=${encodeURIComponent(movieTitle)}&s=tt&ttype=ft&ref_=fn_ft`;
  }
}

// Function to get high-resolution poster URL from IMDB via TMDB
export async function getImdbPosterUrl(movieTitle: string): Promise<string> {
  try {
    // Use TMDB API to get movie details and poster
    const tmdbApiKey = '8c247ea0b4b56ed2ff7d41c9a833aa77'; // Free public API key
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(movieTitle)}&language=en-US&page=1&include_adult=false`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0]; // Get the first (most relevant) result
      
      if (movie.poster_path) {
        // TMDB provides high-resolution poster URLs
        // Use w780 for better quality on large displays
        return `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
      }
    }
    
    // Fallback to original poster URL if no TMDB poster found
    return '';
  } catch (error) {
    console.error('Error getting IMDB poster URL:', error);
    return '';
  }
}

// Function to get high-resolution poster URL (legacy function for backward compatibility)
export function getHighResPosterUrl(posterUrl: string): string {
  if (!posterUrl) {
    return getPlaceholderImage();
  }
  
  // For now, return the original URL to ensure images load
  // We can enhance this later once we understand the URL patterns better
  return posterUrl;
  
  // TODO: Implement proper high-resolution URL detection
  // The previous implementation was causing broken images
  // We need to analyze the actual URL patterns from Rotten Tomatoes first
}

// Function to get a placeholder image when poster is not available
export function getPlaceholderImage(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7im4DvuI88L3RleHQ+Cjwvc3ZnPgo=';
} 