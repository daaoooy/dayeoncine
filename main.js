const API_KEY = "33eb14d86744c1003e81d31f75890b8c";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2ViMTRkODY3NDRjMTAwM2U4MWQzMWY3NTg5MGI4YyIsIm5iZiI6MS43NDYwODQzNzc5Njk5OTk4ZSs5LCJzdWIiOiI2ODEzMjIxOWY3OTc5OWUwNzBmYzZlZDAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.chRV3pmx8Ir0CDPFoahr_LSkAniVO1DWrHKn01mfZYw",
  },
};

/**
 * API 연동 test - 현재 상영 중인 영화 정보
 */
function showNowPlaying() {
  let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`;
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results, "now-playing");

      document.querySelectorAll(".movie").forEach((item) => {
        item.addEventListener("click", () => {
          let movieId = item.getAttribute("movie-id");
          fetchMovieDetails(movieId);
        });
      });
    });
}

/**
 * API 연동 test - 인기 영화 정보
 */
function showPopular() {
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results, "popular");

      document.querySelectorAll(".movie").forEach((item) => {
        item.addEventListener("click", () => {
          let movieId = item.getAttribute("movie-id");
          fetchMovieDetails(movieId);
        });
      });
    });
}

/**
 * API 연동 test - 영화 상세 정보
 */
function fetchMovieDetails(movieId) {
  let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`;
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      showModal(data);
    });
}

/**
 * 영화 정보 화면에 띄우기
 */
function showMovies(movies, elementId) {
  let box = document.getElementById(elementId);
  box.innerHTML = "";
  movies.forEach((movie) => {
    let title = movie.title;
    let overview = movie.overview;
    let poster_path = movie.poster_path;
    let image_url = `https://image.tmdb.org/t/p/w500${poster_path}`;
    let vote_average = movie.vote_average;

    let html = `
      <div class="movie" movie-id="${movie.id}">
        <img src="${image_url}">
        <h2>${title}</h2>
        <p>${overview}</p>
        <p>⭐ ${vote_average}</p>
      </div>
    `;
    box.innerHTML += html;
  });
}

function showSearchMovie(movies, className) {
  let box = document.querySelector(className);
  box.innerHTML = "";
  movies.forEach((movie) => {
    let title = movie.title;
    let overview = movie.overview;
    let poster_path = movie.poster_path;
    let image_url = `https://image.tmdb.org/t/p/w500${poster_path}`;
    let vote_average = movie.vote_average;

    let html = `
      <div class="item" movie-id="${movie.id}">
        <img src="${image_url}">
        <h2>${title}</h2>
        <p>${overview}</p>
        <p>⭐ ${vote_average}</p>
      </div>
    `;
    box.innerHTML += html;
  });
}

/**
 * 영화 검색
 */
function searchMovies(input) {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${input}`;

  document.querySelector(".now-playing-box").style.display = "none";
  document.querySelector(".popular-box").style.display = "none";
  document.querySelector(".search-list").style.gridTemplateColumns =
    "1fr 1fr 1fr 1fr 1fr";

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      let movies = data.results;
      let movieList = document.querySelector(".search-list");
      movieList.innerHTML = "";

      if (movies.length == 0) {
        movieList.innerHTML = "<p>검색 결과가 없습니다.</p>";
        movieList.style.gridTemplateColumns = "1fr";
        return;
      }

      showSearchMovie(movies, ".search-list");

      /**
       * 상세 정보 보여주기
       */
      document.querySelectorAll(".item").forEach((item) => {
        item.addEventListener("click", () => {
          let movieId = item.getAttribute("movie-id");
          fetchMovieDetails(movieId);
        });
      });
    });
}

/**
 * 상세 정보 모달
 */
function showModal(movie) {
  let modal = document.querySelector(".detail-modal");
  let modalBody = document.querySelector(".modal-body");

  const image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  let genresArray = [];
  let contriesArray = [];
  let companiesArray = [];

  let limit;
  if (movie.adult) {
    limit = "만 19세 미만 관람 불가";
  } else {
    limit = "청소년 관람 가능";
  }

  for (let i = 0; i < movie.genres.length; i++) {
    genresArray.push(movie.genres[i].name);
  }

  for (let i = 0; i < movie.production_countries.length; i++) {
    contriesArray.push(movie.production_countries[i].name);
  }

  for (let i = 0; i < movie.production_companies.length; i++) {
    companiesArray.push(movie.production_companies[i].name);
  }

  let genreNames = genresArray.join(", ");
  let countries = contriesArray.join(", ");
  let companies = companiesArray.join(", ");

  modalBody.innerHTML = `
    <img src="${image_url}"/>
    <h2>${movie.title}</h2>
    <p>원제: ${movie.original_title}</p>
    <p>장르: ${genreNames}</p>
    <p>개봉일: ${movie.release_date}</p>
    <p>평점:⭐ ${movie.vote_average}</p>
    <p>러닝타임: ${movie.runtime}분</p>
    <p>관람등급: ${limit}</p>
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

  let searchButton = document.querySelector(".search-button");
  let searchInput = document.querySelector(".search-input");
  let testButton = document.querySelector(".start-button");

  testButton.addEventListener("click", () => {
    if (testButton.innerText == "검색 ON") {
      document.querySelector(".search-box").style.display = "block";
      testButton.innerText = "검색 OFF";
    } else {
      document.querySelector(".search-box").style.display = "none";
      document.querySelector(".search-list").style.display = "none";
      testButton.innerText = "검색 ON";
    }
  });

  searchButton.addEventListener("click", () => {
    let input = searchInput.value.trim();
    document.querySelector(".search-list").style.display = "";

    searchMovies(input);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      searchButton.click();
    }
  });

  document.querySelector(".back").addEventListener("click", () => {
    document.querySelector(".detail-modal").style.display = "none";
  });
});
