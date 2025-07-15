// Utility function to get IMDB movie URL
export async function getImdbUrl(movieTitle: string): Promise<string> {
  try {
    // For now, we'll use a simple approach to get the IMDB ID
    // This could be enhanced with a proper IMDB API or search service
    const searchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movieTitle)}&s=tt&ttype=ft&ref_=fn_ft`;
    
    // Since we can't make server-side requests from the client,
    // we'll use a fallback approach for now
    // In a production app, you'd want to use IMDB's API or a movie database API
    
    // For now, return the search URL as a fallback
    // TODO: Implement proper IMDB ID lookup
    return searchUrl;
  } catch (error) {
    console.error('Error getting IMDB URL:', error);
    // Fallback to search URL
    return `https://www.imdb.com/find/?q=${encodeURIComponent(movieTitle)}&ref_=nv_sr_sm`;
  }
}

// Function to get high-resolution poster URL
export function getHighResPosterUrl(posterUrl: string): string {
  console.log('getHighResPosterUrl called with:', posterUrl);
  
  if (!posterUrl) {
    console.log('No poster URL provided, returning placeholder');
    return getPlaceholderImage();
  }
  
  // For now, return the original URL to ensure images load
  // We can enhance this later once we understand the URL patterns better
  console.log('Returning original URL:', posterUrl);
  return posterUrl;
  
  // TODO: Implement proper high-resolution URL detection
  // The previous implementation was causing broken images
  // We need to analyze the actual URL patterns from Rotten Tomatoes first
}

// Function to get a placeholder image when poster is not available
export function getPlaceholderImage(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7im4DvuI88L3RleHQ+Cjwvc3ZnPgo=';
} 