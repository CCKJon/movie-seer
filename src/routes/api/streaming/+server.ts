// Import necessary modules
//@ts-nocheck
import { json } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';

// import type { RouteParams } from '../[user]/[year]/$types.js';
let number;
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

  document.querySelectorAll('.js-tile-link .posterImage').forEach((element) => {
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



async function getMovieData(number) {
  const URL = `https://www.rottentomatoes.com/browse/movies_at_home/sort:newest?page=${number}`
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return await response.text();
}

export const POST = async ({ request }) => {
  const number = await request.json();
  console.log("this is my number", number)
  const html = await getMovieData(number);
  let movieData = parseMovieData(html)

  return new Response( movieData, { status: 200 });
}








