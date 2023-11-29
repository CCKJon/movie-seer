// +page.ts
export async function load({fetch}) {
  const movieData = await fetch('/api/theater', {
			method: 'POST',
			headers: {
        'Content-Type': 'application/json'
    },
      body: "1",
  })
  
  let data = await movieData.json()

  return { data };
}