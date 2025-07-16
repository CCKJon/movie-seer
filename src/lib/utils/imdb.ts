// Utility function to get IMDB movie URL
export async function getImdbUrl(movieTitle: string): Promise<string> {
  try {
    // Use TMDB API to get IMDb ID
    const tmdbApiKey = '8c247ea0b4b56ed2ff7d41c9a833aa77'; // Free public API key
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(movieTitle)}&language=en-US&page=1&include_adult=false`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0]; // Get the first (most relevant) result
      
      // Get the movie details to get the IMDb ID
      const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}&append_to_response=external_ids`;
      const detailsResponse = await fetch(detailsUrl);
      
      if (detailsResponse.ok) {
        const details = await detailsResponse.json();
        
        if (details.external_ids && details.external_ids.imdb_id) {
          // Construct the proper IMDb URL
          return `https://www.imdb.com/title/${details.external_ids.imdb_id}/`;
        }
      }
    }
    
    // Fallback to search URL if no IMDb ID found
    return `https://www.imdb.com/find/?q=${encodeURIComponent(movieTitle)}&s=tt&ttype=ft&ref_=fn_ft`;
  } catch (error) {
    console.error('Error getting IMDB URL:', error);
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
        // Use the original size (w500) for high quality
        return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
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