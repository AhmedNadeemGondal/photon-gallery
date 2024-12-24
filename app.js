// https://www.pexels.com/api/key/
const auth = "uSu4JhnDxGmbHIfVzzww7r0shDEn16N9ALdlAMy10nCOhOuNAYh5ag6O";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

searchInput.addEventListener("input", (e) => (searchValue = e.target.value));
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});
more.addEventListener("click", loadMore);

//Direct API Call
// async function fetchAPI(url) {
//   const dataFetch = await fetch(url, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       Authorization: auth,
//     },
//   });
//   const data = await dataFetch.json();
//   return data;
// }
//

// API call using server.js
// async function fetchAPI(url) {
//   const dataFetch = await fetch(
//     `http://localhost:3000/api/fetchData?url=${encodeURIComponent(url)}`,
//     {
//       method: "GET",
//     }
//   );
//   const data = await dataFetch.json();
//   return data;
// }

//API call for Vercel
async function fetchAPI(url) {
  const response = await fetch(`/api/fetchData?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  return data;
}

function genPics(data) {
  data.photos.forEach((photo) => {
    const gallImg = document.createElement("div");
    gallImg.classList.add("gallery-img");
    gallImg.innerHTML = `
        <div class="gallery-info">
          <p>${photo.photographer}</p>
          <a href=${photo.src.original}>Download</a>
        </div>
          <img src=${photo.src.large}/>
          `;
    gallery.appendChild(gallImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchAPI(fetchLink);
  genPics(data);
}

async function searchPhotos(query) {
  gallery.innerHTML = "";
  searchInput.innerText = "";
  fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
  const data = await fetchAPI(fetchLink);
  genPics(data);
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchAPI(fetchLink);
  genPics(data);
}

curatedPhotos();

//
//
//
const overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);

overlay.innerHTML = `
  <div class="overlay-content">
    <img id="overlay-image" src="" alt="Expanded View">
    <button class="close-button">&times;</button>
  </div>
`;

const overlayImage = overlay.querySelector("#overlay-image");
const closeButton = overlay.querySelector(".close-button");

gallery.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    overlayImage.src = e.target.src;
    overlay.classList.add("active");
  }
});

closeButton.addEventListener("click", () => {
  overlay.classList.remove("active");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});
