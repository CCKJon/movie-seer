// Import necessary modules
//@ts-nocheck
import { json } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';

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
  return streamablemovies;
}

function parseTheaterMovieData(html: string) {
  const { document } = parseHTML(html);
  let theatertitles = [];
  let theaterreleasedates = [];
  let theatermovieposters = [];

  document.querySelectorAll('.js-tile-link [data-qa="discovery-media-list-item-title"]').forEach((element) => {
    const title = element.textContent.trim();
    theatertitles.push(title);
  });

  document.querySelectorAll('.js-tile-link [data-qa="discovery-media-list-item-start-date"]').forEach((element) => {
    const theaterreleasedate = element.textContent.trim();
    theaterreleasedates.push(theaterreleasedate);
  });

  document.querySelectorAll('.js-tile-link .posterImage').forEach((element) => {
    const posterSrc = element.getAttribute('src');
    theatermovieposters.push(posterSrc);
  });

  let theatermovies = theatertitles.map((item, index) => ({
    title: item,
    theater_date: theaterreleasedates[index],
    postersrc: theatermovieposters[index],
  }));

  console.log("theater movies", theatermovies)
  return theatermovies;
}

async function getTheaterMovieData(number) {
  const URL = `https://www.rottentomatoes.com/browse/movies_coming_soon/?page=${number}`
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return await response.text();
}

export const POST = async ({ request }) => {
  try {
    const theaternumber = await request.json();
    console.log("this is my theater number", theaternumber)
    const html = await getTheaterMovieData(theaternumber);
    let theatermovieData = parseTheaterMovieData(html)

    return json(theatermovieData);
  } catch (error) {
    console.error('Error in theater API:', error);
    return json({ error: 'Failed to fetch theater data' }, { status: 500 });
  }
}



