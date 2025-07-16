// +page.ts
export async function load({fetch}: any) {
  const movieData = await fetch('/api/bluray', {
			method: 'POST',
			headers: {
        'Content-Type': 'application/json'
    },
      body: "1",
  })
  
  let data = await movieData.json()

  return { data };
} 