const ApiURl = "https://api.github.com/users/";
const main = document.querySelector("main");
const loader = document.querySelector(".loader");
const navBar = document.querySelector(".page-nav");
const navBarBtn = document.querySelector(".pagination-bar");

var perPage = 10;
var globalpageNumber = 1;
var maxPage = 1;
var userName = "";

const formSubmit = () => {
  const searchBox = document.querySelector(".searchBar");
  if (searchBox.value !== "") {
    getUserData(searchBox.value);
    userName = searchBox.value;
  }
  return false;
};

const pageNumberSubmit = () => {
  const perPageBox = document.querySelector(".pageBar");
  if (perPageBox.value !== "") {
    if (perPageBox.value > 100) {
      perPage = 100;
    }
    perPage = perPageBox.value;
    console.log(perPageBox.value);
    getUserData(userName);
  }
  return false;
};

const getUserData = async (username) => {
  loader.classList.remove("hidden");
  fetch(ApiURl + username)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      loader.classList.add("hidden");

      const pageNumber = Math.ceil(data.public_repos / perPage);
      maxPage = pageNumber;

      const card = `<div class="user-info">
      <img
        class="user-img"
        src="${data.avatar_url}"
        alt="user-image"
      />

      <div class="user-info-left">
        <h1 class="user-name">${data.name}</bh1>
        <h3 class="user-bio">${data.Bio || ""}</h3>
        ${
          data.location
            ? `<h3 class="user-location">
              <i class="fa-solid fa-location-dot"></i> ${data.location}
            </h3>`
            : ""
        }
        
        ${
          data.twitter_username
            ? `<a class="user-handle" href="https://twitter.com/${data.twitter_username}">
            <h3 >
              Twitter
            </h3>
            </a>`
            : ""
        } 
        
      </div>
    </div>
    <a class="user-link" href="${
      data.html_url
    }"><h3><i class="fa-solid fa-link"></i> ${data.html_url}</h3></a>
    <div class="user-repos"></div>
    `;

      main.innerHTML = card;
      getRepos(userName, 1, perPage);
      getPageNav(userName, 1, pageNumber);
    })
    .catch((error) => {
      loader.classList.add("hidden");
      console.log(error);
      main.innerHTML = `<h1 class="error">User Not Found</h1>`;
    })
    .finally(() => {
      //console.log("apli call done");
    });
};

const getRepos = async (username, pageNumber) => {
  const userRepos = document.querySelector(".user-repos");
  console.log(pageNumber);

  fetch(
    ApiURl + username + "/repos?per_page=" + perPage + "&page=" + pageNumber
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      {
        console.log(data);
        let tempRepo = "";
        data.map((element) => {
          const repoTags = element.topics;
          const repoTag = repoTags.map((tag) => {
            return `<li>${tag}</li>`;
          });

          if (repoTag.length > 4) {
            const n = repoTag.length;
            const m = n - 4;
            repoTag.splice(4, m);
            repoTag.push(`<li>+${m}</li>`);
          }

          const repo = `<div class="cards">
          <a class="repo-name" href="${element.html_url}">${element.name}</a>
          <h4 class="repo-desc">${element.description || ""}</h4>
          <ul class="repo-tags">${repoTag.join(" ")}</ul>
          </div>`;
          tempRepo += repo;
        });
        userRepos.innerHTML = tempRepo;
      }
    })
    .catch((error) => {
      console.log(error);
      main.innerHTML = `<h1 class="error">User Not Found</h1>`;
    })
    .finally(() => {
      console.log("apli call for repos done");
    });
};

const getPageNav = (username, pageNumber, maxPageNumber) => {
  let tempNavBar = "";
  for (let i = 1; i <= maxPageNumber; i++) {
    const navLink = `<li ${
      i === 1 ? "class=active" : " "
    } onclick='getRepos_util(event)'>${i}</li>`;
    tempNavBar += navLink;
  }
  navBar.innerHTML = tempNavBar;
  if (maxPageNumber > 1) {
    navBar.innerHTML =
      `<li onclick='prevRepo_Util(event)'>&laquo;</li>` + navBar.innerHTML;
    navBar.innerHTML += `<li onclick='nextRepo_Util(event)'>&raquo;</li>`;
  }
};

function getRepos_util(event) {
  const btnValue = event.target.innerHTML;
  globalpageNumber = btnValue;
  const currentPage = document.querySelector(".active");
  currentPage.classList.remove("active");
  event.target.classList.add("active");
  getRepos(userName, btnValue);
}

function nextRepo_Util(event) {
  const currentPage = document.querySelector(".active");
  if (maxPage > currentPage.innerHTML) {
    currentPage.classList.remove("active");
    currentPage.nextElementSibling.classList.add("active");
    globalpageNumber++;
    getRepos(userName, globalpageNumber);
  }
}

function prevRepo_Util(event) {
  const currentPage = document.querySelector(".active");
  if (currentPage.innerHTML > 1) {
    currentPage.classList.remove("active");
    currentPage.previousElementSibling.classList.add("active");
    globalpageNumber--;
    getRepos(userName, globalpageNumber);
  }
}
