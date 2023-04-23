// const buttonElement = document.getElementById("button-form");
// const inputNameElement = document.getElementById("input-name");
// const textareaElement = document.getElementById("textarea-form");
// const commentListElement = document.getElementById("comment-list");

import { getComments, postComments } from "./api.js";
import { renderLoginComponent } from "./login-components.js";
import { format } from "date-fns";

let comments = [];
let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";

token = null;

const fetchAndRender = () => {
  return getComments({ token }).then((responseData) => {
    const formatDate = (date) => {
      const createDate = format(new Date(date), 'yyyy-MM-dd hh.mm.ss')
      return createDate;
    }
    comments = responseData.comments.map((comment) => {
      return {
        name: comment?.author?.name,
        date: `${formatDate(comment.date)}`,
        text: comment.text,
        likes: comment.likes,
        isLiked: false,
      };
    });
    renderApp();
  });
};

const renderApp = () => {
  const appElement = document.getElementById("app");
  const commentsHtml = comments
    .map((comment, index) => {
      return `<li class="comment">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text" data-index='${index}'> ${comment.text}</div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button data-index='${index}' class="like-button ${comment.paint}" ></button>
        </div>
      </div>
    </li>`;
    })
    .join("");

  const appHtml = `<main class="container">
      <ul class="comments" id="comment-list">
    <!--список в JS-->     
    ${commentsHtml}   
      </ul>  
      <article class="add-form">
        <input
          id="input-name"
          type="text"
          class="add-form-name"
          placeholder="Введите ваше имя"/>
    <textarea
          id="textarea-form"
          type="textarea"
          class="add-form-text"
          placeholder="Введите ваш комментарий"
          rows="4"></textarea>
        <div class="add-form-row">
          <button class="add-form-button" id="button-form">Написать</button>
        </div>
      </article>
    </main>`;

  appElement.innerHTML = appHtml;

  if (!token) {
    renderLoginComponent({appElement, setToken: (newToken) => {
      token = newToken;
    }, fetchAndRender,
  })
    return;
  }

  const buttonElement = document.getElementById("button-form");
  const inputNameElement = document.getElementById("input-name");
  const textareaElement = document.getElementById("textarea-form");

  const newComment = () => {
    const createDate = format(new Date(date), 'yyyy-MM-dd hh.mm.ss');

    postComments({
      token,
      name: inputNameElement.value,
      text: textareaElement.value,
      date: `${createDate}`,
    })
      .then((response) => {
        if (response.status === 500) {
          return Promise.reject(new Error("Сервер упал"));
        } else if (response.status === 400) {
          return Promise.reject(new Error("Неправильный ввод"));
        } else {
          return fetchAndRender();
        }
      })
      .then(() => {
        buttonElement.disabled = false;
        inputNameElement.value = "";
        textareaElement.value = "";
      })
      .catch((error) => {
        buttonElement.disabled = false;
        if (error.message === "Сервер упал") {
          return newComment();
        }
        if (error.message === "Неправильный ввод") {
          alert("Имя и комментарий должны быть не короче 3 символов");
        } else {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        }
      });
  };
  buttonElement.addEventListener("click", newComment);
  initEventListeners();
};
renderApp();

// лайки
const initEventListeners = () => {
  const likeButtonElements = document.querySelectorAll(".like-button");

  for (const likeButtonElement of likeButtonElements) {
    const index = +likeButtonElement.dataset.index;
    likeButtonElement.addEventListener("click", () => {
      if (comments[index].isLiked === false) {
        comments[index].paint = "-active-like";
        comments[index].likes += 1;
        comments[index].isLiked = true;
      } else {
        comments[index].paint = "";
        comments[index].likes -= 1;
        comments[index].isLiked = false;
      }
      renderApp();
    });
  }
};
// fetchAndRender();
initEventListeners();
