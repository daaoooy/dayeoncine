const API_KEY = "33eb14d86744c1003e81d31f75890b8c";

function searchMovies(input) {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${input}`;

  document.querySelector("#now-playing-box").style.display = "none";
  document.querySelector("#popular-box").style.display = "none";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let movies = data.results;
      let movieList = document.querySelector("#item-list");
      movieList.innerHTML = "";

      if (movies.length == 0) {
        movieList.innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
      }

      movies.forEach((movie) => {
        let title = movie.title;
        let overview = movie.overview;
        let poster_path = movie.poster_path;
        let popularity = movie.popularity;
        let image_url = poster_path
          ? `https://image.tmdb.org/t/p/w500${poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image";

        let temp_html = `
            <div class="item">
              <img src="${image_url}" alt="${title}">
              <h2>${title}</h2>
              <p>${overview}</p>
              <p>⭐ ${popularity}</p>
            </div>
          `;
        movieList.innerHTML += temp_html;
      });
    });
}

function showNowPlaying() {
  let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results, "now-playing");
    });
}

function showPopular() {
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results, "popular");
    });
}

function showMovies(movies, elementId) {
  let container = document.getElementById(elementId);
  container.innerHTML = "";
  movies.forEach((movie) => {
    let title = movie.title;
    let overview = movie.overview;
    let poster_path = movie.poster_path;
    let image_url = poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    let html = `
      <div class="movie">
        <img src="${image_url}" alt="${title}">
        <h2>${title}</h2>
        <p>${overview}</p>
      </div>
    `;
    container.innerHTML += html;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  showNowPlaying();
  showPopular();

  let searchButton = document.querySelector("#search-button");
  let searchInput = document.querySelector("#search-input");

  searchButton.addEventListener("click", () => {
    let input = searchInput.value.trim();
    searchMovies(input);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchButton.click();
    }
  });
});
