export const requests = {
  "New York Times Best Sellers": 'https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=AGzqWD9YGGW30g0iAYPV67rNfBwsO0YG',
  googleapi: {
    genre: (genre) => {
      return `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=30`
    },
    isbn: (isbn) => {
      return `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    },
    bytitle: (bytitle) => {
      return `https://www.googleapis.com/books/v1/volumes?q=intitle:${bytitle}&maxResults=30`
    },
    byauthor: (author) => {
      return `https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&maxResults=30`
    },
    query: (query) => {
      return `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=30`
    }
  },
  fastapi: {
    books: (page) => {
      return `http://localhost:8000/books/${page}`;
    },
    users: (userid) => {
      return `http://localhost:8000/users/${userid}`;
    },
    ratings: (userid) => {
      return `http://localhost:8000/rated/${userid}`;
    },
    rating: (userid, isbn) => {
      return `http://localhost:8000/rated/${userid}/${isbn}`;
    },
    recommend: (userid) => {
      return `http://localhost:8000/user-item/${userid}`
    },
    postrating: () => {
      return `http://localhost:8000/rate`
    }
  },
  truncate: (str, n) => {
    return str?.length > n ? str.substr(0, n - 3) + "..." : str;
  },
  getauthors: (o) => {
    let str = o[0];
    for (let i = 1; i < o.length; i++) {
      str = str + ", " + o[i];
    }
    return str;
  },
  genres: ["Fantasy", "Romance", "Thrillers", "Action", "Fiction", "Self Help"],
  types: ["bytitle", "byauthor", "query", "isbn"],
  userNamesList: { "1": "sarah", "2": "john", "3": "mary", "4": "ann", "5": "mark" },
  userIDsList: { "1": "13552", "2": "215986", "3": "55492", "4": "100459", "5": "137742" },
  currentUser: { "index": 1, "userID": 13552, "userName": "sarah" },
  setuser: (index, userID, userName) => {
    requests.currentUser.index = index;
    console.log("set to ", requests.currentUser.userName);
    requests.currentUser.userID = userID;
    requests.currentUser.userName = userName;
    console.log("set to ", requests.currentUser.userName);
  },
  setCurrentUserName: (name) => {
    requests.userNamesList[`${requests.currentUser.index}`] = name;
  }
}

export default requests