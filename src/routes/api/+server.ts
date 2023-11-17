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
  let movieposters = [];

  document.querySelectorAll('.p--small[data-qa="discovery-media-list-item-title"]').forEach((element) => {
    const title = element.textContent.trim();
    titles.push(title);
  });

  document.querySelectorAll('.smaller[data-qa="discovery-media-list-item-start-date"]').forEach((element) => {
    const releasedate = element.textContent.trim();
    releasedates.push(releasedate);
  });

  document.querySelectorAll('img.posterImage').forEach((element) => {
    const posterSrc = element.getAttribute('src');
    movieposters.push(posterSrc);
  });

  let streamablemovies = titles.map((item, index) => ({
  title: item,
  streaming_date: releasedates[index],
  postersrc: movieposters[index],
}));

  console.log("streamable movies", streamablemovies)
  const jsonString = JSON.stringify(streamablemovies)

  return jsonString; 
}

//   async function getMovieDescription(movietitle) {
//     const URL = `https://www.google.com/search?q=${movietitle}+movie&client`
//     const response = await fetch(URL);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch: ${response.status}`);
//     }
//     console.log("this is my response", response)
//   return await response.text();
// }


async function getMovieData() {
  const URL = "https://www.rottentomatoes.com/browse/movies_at_home/sort:newest?page=4"
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return await response.text();
}

export const GET = async () => {
  const html = await getMovieData();
  let movieData = parseMovieData(html)

  return new Response( movieData, { status: 200 });
}




