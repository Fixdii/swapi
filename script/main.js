const PEOPLE_BY_PAGE_URL = "https://swapi.dev/api/people/?page=1";
const SEARCH_POPLE_BY_NAME_URL = 'https://swapi.dev/api/people/?search=';

const buttonLoad = document.querySelector(".button-load");
const content = document.querySelector(".content-load");

let nextURL = '';
let previosURL = '';

function getPage(url) {
  const query = url.split('?')[1];
  const page = query 
    ? query
      .split('&')
        .find((elem, i, arr) => elem.indexOf('page') !== -1)
      ?.split('=')[1] 
      || 1
    : 1;

  return +page;
}

function sendRequest(url) {
  const method = 'GET';

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        const people = JSON.parse(xhr.response);

        nextURL = people.next;
        previosURL = people.previous;

        resolve(people);
      }
    };

    xhr.onerror = () => {
      reject("Запрос не удался");
    };

    xhr.send();
  });
}


function loadContent(people, page) {
    const divForDelete = content.firstChild;
    divForDelete && divForDelete.remove();
    addContent(people, page);
  }

  function addContent(people, page) {
    let div = document.createElement("div");
    let ol = document.createElement("ol");
    ol.start = "6";
    ol.className = "rounded";
    div.append(ol);
    content.append(div);

    people.results.forEach((item, i) => {
      let li = document.createElement("li");   

      if (i === 0) {

        li.style=`counter-reset: li ${(page * 10) - 10};`;
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
          (element) => element.firstChild.innerHTML === `Name:${name}`
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
    buttonNext.append("Next");
    buttonNext.style.float = "right";
    let buttonPrevious = document.createElement("button");
    buttonPrevious.className = "button-load";
    buttonPrevious.append("Previous");
    buttonPrevious.style.float = "left";
    div.append(buttonNext);
    div.append(buttonPrevious);

    buttonNext.addEventListener("click", (event) => {
      event.preventDefault();
      pageCheck(true);
    });
    buttonPrevious.addEventListener("click", (event) => {
      event.preventDefault();
      pageCheck(false);
    });
  }

  function addInfo(people, li, name) {
    let ol2 = document.createElement("ol");
    ol2.className = "rounded info";
    li.append(ol2);

    people.results.forEach((item) => {
      if (item.name == name) {
        for (const key of Object.keys(item)) {
          let li2 = document.createElement("li");
          li2.append(key[0].toUpperCase() + key.slice(1) + ":" + item[key]);
          ol2.append(li2);
        }
      }
    });
  }

  function pageCheck(isNext) {
    if (isNext) {
      if (!!nextURL) {
        loadPageContent(nextURL);
      } else {
        alert("Список окончен");
      }
    } else {
      if (!!previosURL) {
        loadPageContent(previosURL);
      } else {
        alert("Список окончен");
      }
    }
  }


function init() {
  loadPageContent();

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("search");

  searchButton.addEventListener("click", (event) => {
    const requestURL = `${SEARCH_POPLE_BY_NAME_URL}${searchInput.value}`;
    const page = getPage(requestURL);
    sendRequest(requestURL)
      .then((people) => loadContent(people, page))
      .catch((err) => console.error(err));
  })
}

function loadPageContent(url = PEOPLE_BY_PAGE_URL) {
  const page = getPage(url);

  sendRequest(url)
    .then((people) => loadContent(people, page))
    .catch((err) => console.error(err));
}

window.addEventListener('DOMContentLoaded', () => init());