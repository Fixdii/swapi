const PEOPLE_BY_PAGE_URL = "https://swapi.dev/api/people/";

const buttonLoad = document.querySelector(".button-load");
const content = document.querySelector(".content-load");
const page = document.querySelector(".page");

let searchInput;

let nextURL = "";
let previousURL = "";
let allPages = 0;

function getPage(url) {
  const query = url.split("?")[1];
  const page = query
    ? query
        .split("&")
        .find((elem, i, arr) => elem.indexOf("page") !== -1)
        ?.split("=")[1] || 1
    : 1;
  return +page;
}

function countPage(allPages, currentPage) {
  page.textContent =
    "page" +
    " " +
    currentPage +
    " " +
    "of" +
    "  " +
    Math.ceil(allPages.count / 10);
}

function getSearch(url) {
  const query = url.split("?")[1];
  const search = query
    ? query
        .split("&")
        .find((elem, i, arr) => elem.indexOf("search") !== -1)
        ?.split("=")[1] || ""
    : "";

  return search;
}

function sendRequest(url) {
  const method = "GET";

  return fetch(url, { method }).then((res) => {
    const searchQuery = getSearch(res.url);

    if (searchQuery) {
      if (searchQuery !== searchInput.value) {
        throw new Error("wrongSearch");
      }
    }

    return res.json();
  });
}

function setNext(nextUrl = nextURL) {
  const buttonNext = document.getElementById("button-next");
  nextURL = nextUrl;

  if (!buttonNext) {
    return;
  }

  if (!nextUrl) {
    buttonNext.disabled = true;
  } else {
    buttonNext.disabled = false;
  }
}

function setPrev(prevUrl = previousURL) {
  const buttonPrevious = document.getElementById("button-previous");
  previousURL = prevUrl;

  if (!buttonPrevious) {
    return;
  }

  if (!prevUrl) {
    buttonPrevious.disabled = true;
  } else {
    buttonPrevious.disabled = false;
  }
}

function loadContent(people, page) {
  setNext(people.next);
  setPrev(people.previous);

  allPages = people.count;

  const divForDelete = content.firstChild;
  if(divForDelete){
    divForDelete.remove();
  }

  addContent(people, page);
}

function addContent(people, page) {
  let div = document.createElement("div");
  let ol = document.createElement("ol");
  ol.className = "rounded";
  div.append(ol);
  content.append(div);

  people.results.forEach((item, i) => {
    let li = document.createElement("li");

    if (i === 0) {
      li.style = `counter-reset: li ${page * 10 - 10};`;
    }
    let a = document.createElement("a");
    a.href = "#";
    a.append(item.name);
    li.append(a);
    ol.append(li);

    a.addEventListener("click", (event) => {
      event.preventDefault();
      const name = event.target.innerHTML;
      const ols = Array.prototype.slice.call(
        document.querySelectorAll(".rounded")
      );

      const existOl = ols.find(
        (element) => element.firstChild.innerHTML === `Name: ${name}`
      );

      if (existOl) {
        existOl.remove();
      } else {
        addInfo(people, li, item.name);
      }
    });
  });

  let buttonNext = document.createElement("button");
  buttonNext.className = "button-load";
  buttonNext.id = "button-next";
  buttonNext.append("Next");
  buttonNext.style.float = "right";
  let buttonPrevious = document.createElement("button");
  buttonPrevious.className = "button-load";
  buttonPrevious.append("Previous");
  buttonPrevious.id = "button-previous";
  buttonPrevious.style.float = "left";
  div.append(buttonNext);
  div.append(buttonPrevious);

  buttonNext.addEventListener("click", (event) => {
    event.preventDefault();
    pageCheck(true, buttonNext);
  });
  buttonPrevious.addEventListener("click", (event) => {
    event.preventDefault();
    pageCheck(false, buttonPrevious);
  });

  setNext();
  setPrev();
}

function addInfo(people, li, name) {
  let ol2 = document.createElement("ol");

  ol2.className = "rounded info";
  li.append(ol2);

  people.results.forEach((item) => {
    if (item.name == name) {
      for (const key of Object.keys(item)) {
        if (key == "gender") {
          return;
        }
        let li2 = document.createElement("li");
        li2.append(
          key[0].toUpperCase() + key.slice(1).split("_")[0] + ": " + item[key]
        );
        ol2.append(li2);
      }
    }
  });
}

function pageCheck(isNext, btn) {
  if (isNext) {
    if (!!nextURL) {
      loadPageContent(nextURL);
    } else {
    }
  } else {
    if (!!previousURL) {
      loadPageContent(previousURL);
    } else {
    }
  }
}

function init() {
  loadPageContent();

  searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", (event) => {
    const requestURL = `${PEOPLE_BY_PAGE_URL}?search=${searchInput.value}`;
    const page = getPage(requestURL);

    sendRequest(requestURL)
      .then((people) => {
        loadContent(people, page);
        countPage(people, page);
      })
      .catch((err) => {
        if (err.message !== "wrongSearch") {
          console.error(err);
        }
      });
  });
}

function loadPageContent(url = PEOPLE_BY_PAGE_URL) {
  const page = getPage(url);

  sendRequest(url)
    .then((people) => {
      loadContent(people, page);
      countPage(people, page);
    })
    .catch((err) => console.error(err));
}

window.addEventListener("DOMContentLoaded", () => init());
