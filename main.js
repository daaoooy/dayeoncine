const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2ViMTRkODY3NDRjMTAwM2U4MWQzMWY3NTg5MGI4YyIsIm5iZiI6MS43NDYwODQzNzc5Njk5OTk4ZSs5LCJzdWIiOiI2ODEzMjIxOWY3OTc5OWUwNzBmYzZlZDAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.chRV3pmx8Ir0CDPFoahr_LSkAniVO1DWrHKn01mfZYw",
  },
};

const API_KEY = "33eb14d86744c1003e81d31f75890b8c";

function searchMovies(input) {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${input}`;

  document.querySelector("#now-playing-box").style.display = "none";
  document.querySelector("#popular-box").style.display = "none";

  fetch(url, options)
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
        let vote_average = movie.vote_average;
        let image_url = poster_path
          ? `https://image.tmdb.org/t/p/w500${poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image";

        let temp_html = `
          <div class="item" movie-id="${movie.id}">
            <img src="${image_url}" alt="${title}">
            <h2>${title}</h2>
            <p>${overview}</p>
            <p>⭐ ${vote_average}</p>
          </div>
        `;
        movieList.innerHTML += temp_html;
      });

      document.querySelectorAll(".item").forEach((item) => {
        item.addEventListener("click", () => {
          const movieId = item.getAttribute("movie-id");
          fetchMovieDetails(movieId);
        });
      });
    });
}

function showNowPlaying() {
  let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`;
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results, "now-playing");
    });
}

function showPopular() {
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
  fetch(url, options)
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

function fetchMovieDetails(movieId) {
  let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`;
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      showModal(data);
    });
}

function showModal(movie) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  const image_url = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const genreNames = movie.genres.map((g) => g.name).join(", ");
  const countries = movie.production_countries.map((c) => c.name).join(", ");
  const companies = movie.production_companies.map((c) => c.name).join(", ");
  const isAdult = movie.adult ? "만 19세 미만 관람 불가" : "전체 관람가";

  modalBody.innerHTML = `
    <img src="${image_url}"/>
    <h2>${movie.title}</h2>
    <p>원제: ${movie.original_title}</p>
    <p>장르: ${genreNames}</p>
    <p>개봉일: ${movie.release_date}</p>
    <p>평점:⭐ ${movie.vote_average}</p>
    <p>러닝타임: ${movie.runtime}분</p>
    <p>관람등급: ${isAdult}</p>
    <p>국가: ${countries}</p>
    <p>제작사: ${companies}</p>
    <p>예산: $${movie.budget.toLocaleString()}</p>
    <p>수익: $${movie.revenue.toLocaleString()}</p>
    <p>줄거리: ${movie.overview}</p>
  `;

  modal.classList.remove("hidden");
  modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  showNowPlaying();
  showPopular();

  let searchButton = document.querySelector("#search-button");
  let searchInput = document.querySelector("#search-input");
  let testButton = document.querySelector("#teston-button");

  testButton.addEventListener("click", () => {
    if (testButton.innerText === "검색 ON") {
      document.querySelector("#search-box").style.display = "block";
      testButton.innerText = "검색 OFF";
    } else {
      document.querySelector("#search-box").style.display = "none";
      document.querySelector("#item-list").style.display = "none";
      testButton.innerText = "검색 ON";
    }
  });

  searchButton.addEventListener("click", () => {
    let input = searchInput.value.trim();
    document.querySelector("#item-list").style.display = "";

    searchMovies(input);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      searchButton.click();
    }
  });

  document.querySelector(".back").addEventListener("click", () => {
    document.querySelector("#modal").style.display = "none";
  });
});
