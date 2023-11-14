// +page.ts
export async function load({fetch}) {
  const movieData = await fetch('/api', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
  })
  
  let data = await movieData.json()

  return { data };
}

// +page.ts
// export async function load({ fetch }) {
//   try {
//     // Fetch movie data from the API
//     const movieData = await fetch('/api', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Check if the response is successful
//     if (!movieData.ok) {
//       throw new Error(`Failed to fetch data. Status: ${movieData.status}`);
//     }

//     // Parse the JSON data
//     const data = await movieData.json();

//     // Return the data
//     return { data };
//   } catch (error) {
//     console.error('Error loading data:', error);
//     return { error: 'Failed to load data. Please try again.' };
//   }
// }
