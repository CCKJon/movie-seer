// +page.ts
export async function load({fetch}: any) {
  try {
    const movieData = await fetch('/api/bluray', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: "1",
    })
    
    if (!movieData.ok) {
      return { data: [] };
    }
    
    let data = await movieData.json()

    return { data };
  } catch (error) {
    return { data: [] };
  }
} 