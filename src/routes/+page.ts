// +page.ts
export async function load({fetch}) {
  const movieData = await fetch('/api', {
			method: 'GET',
			// headers: {
			// 	'Content-Type': 'application/json'
			// },
  })
  
  let data = await movieData

  return { data };
}
