export function getComments({token}) {
  return fetch("https://webdev-hw-api.vercel.app/api/v2/dianova-arina/comments", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
      if (response.status === 401) {
      throw new Error('Нет авторизации');
      }
      return response.json()
    })
};
  
export function postComments({token, text, name, date}) {
  return fetch("https://webdev-hw-api.vercel.app/api/v2/dianova-arina/comments", {
        method: "POST",
        body: JSON.stringify({
          name,
          text,
          date,
          likes: 0,
          isLiked: false,
        }),
        headers: {
          Authorization: token,
        },
      }).then((response) => {
        return response.json();
      })
    };

export function loginUser({login, password}) {
  return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
    method: "POST",
    body: JSON.stringify({
    login,
    password
    }),
  }).then((response) => {
    if(response.status === 400) {
      throw new Error ('Неверный логин или пароль')
    }
    return response.json();
  })
};

export function regUser({login, password, name}) {
  return fetch("https://webdev-hw-api.vercel.app/api/user", {
    method: "POST",
    body: JSON.stringify({
    login,
    password,
    name,
    }),
  }).then((response) => {
    if(response.status === 400) {
      throw new Error ('Такой пользователь уже существует')
    }
    return response.json();
  })
};
