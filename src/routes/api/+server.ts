// Import necessary modules
//@ts-nocheck
import { json } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';
// import type { RouteParams } from '../[user]/[year]/$types.js';

// Modified function to parse movie titles
function parseMovieData(html: string) {
  const { document } = parseHTML(html);
  let titles = [];
  let releasedates = [];

  document.querySelectorAll('.p--small[data-qa="discovery-media-list-item-title"]').forEach((element) => {
    const title = element.textContent.trim();
    titles.push(title);
  });

  document.querySelectorAll('.smaller[data-qa="discovery-media-list-item-start-date"]').forEach((element) => {
    const releasedate = element.textContent.trim();
    releasedates.push(releasedate);
  });

  let streamablemovies = titles.map((item, index) => ({
  title: item,
  streaming_date: releasedates[index],
}));

  // return titles;
  console.log("streamable movies", streamablemovies)
  const jsonString = JSON.stringify(streamablemovies)
  // console.log("this is titles", titles)
  // console.log("this is release dates", releasedates)
  return jsonString; 
}



async function getMovieData() {
  // Replace this with your actual URL for fetching movie data
  const URL = "https://www.rottentomatoes.com/browse/movies_at_home/sort:newest"
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return await response.text();
}


// export const GET = async () => {
//   try {
//     const html = await getMovieData();
//     let movieData = parseMovieData(html);

//     return {
//       status: 200,
//       body: JSON.stringify({ movieData }), // Ensure it's a JSON string
//       headers: { 'Content-Type': 'application/json' },
//     };
//   } catch (error) {
//     console.error('Error fetching movie data:', error);
//     return { status: 500, body: 'Internal Server Error' };
//   }
// };



export const GET = async () => {
  const html = await getMovieData();
  // console.log('I THINK THIS IS MY RESPONSE FROM THE GET REQUEST? ', json(parseMovieData(html)))
  let movieData = parseMovieData(html)
  

  
  return new Response( movieData, { status: 200 });
}




