const booksUrl = "http://localhost:3000/books";
const booksUl = document.getElementById("list");
const detailsDiv = document.getElementById("show-panel");
const currentUserId = "1";

document.addEventListener("DOMContentLoaded", function () {
  getBooks();
  booksUl.addEventListener("click", getBook);
  detailsDiv.addEventListener("click", getCurrentUser);
});

const getCurrentUser = (e) => {
  fetch("http://localhost:3000/users/" + currentUserId)
    .then((res) => res.json())
    .then((data) => handleLike(e, data));
};

const getBooks = () => {
  fetch(booksUrl)
    .then((res) => res.json())
    .then((books) => showAllBooks(books))
    .catch((error) => window.alert(error.message));
};

const showAllBooks = (books) => {
  for (const book of books) {
    showBook(book);
  }
};

const showBook = ({ id, title }) => {
  const li = document.createElement("li");
  li.dataset.id = id;
  li.textContent = title;
  booksUl.appendChild(li);
};

const getBook = ({ target }) => {
  if (target.tagName != "LI") {
    return;
  }
  const id = target.dataset.id;
  fetch(booksUrl + "/" + id)
    .then((res) => res.json())
    .then((book) => {
      showBookDetail(book);
    })
    .catch((er) => window.alert(er.message));
};

const showBookDetail = ({
  id,
  title,
  subtitle,
  description,
  author,
  img_url,
  users,
}) => {
  const img = document.createElement("img");
  const titleH3 = document.createElement("h3");
  const subtitleH3 = document.createElement("h3");
  const authorH3 = document.createElement("h3");
  const descriptionP = document.createElement("p");
  const likes = document.createElement("ul");
  const btn = document.createElement("BUTTON");

  // check if user has already liked this book and act accordingly
  if (users.find((user) => user.id == currentUserId)) {
    btn.innerText = "Unlike";
  } else {
    btn.innerText = "Like";
  }
  btn.dataset.id = id;
  img.src = img_url;
  titleH3.textContent = title;
  subtitleH3.textContent = subtitle;
  authorH3.textContent = author;
  descriptionP.textContent = description;
  if (users.length) {
    for (const user of users) {
      li = document.createElement("li");
      li.dataset.id = user.id;
      li.textContent = user.username;
      likes.appendChild(li);
    }
  }
  detailsDiv.innerHTML = "";
  detailsDiv.append(
    img,
    titleH3,
    subtitleH3,
    authorH3,
    descriptionP,
    likes,
    btn
  );
};

const handleLike = (e, currentUser) => {
  if (e.target.tagName != "BUTTON") {
    return;
  }
  const id = e.target.dataset.id;

  fetch(booksUrl + "/" + id)
    .then((res) => res.json())
    .then((data) => {
      // decide if liking or unlikinga nd act accordingly
      if (e.target.innerText === "Like") {
        e.target.innerText = "Unlike";
        data.users.push(currentUser);
      } else {
        e.target.innerText = "Like";
        data.users = data.users.filter((user) => user.id != currentUserId);
      }
      fetch(booksUrl + "/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application.json",
        },
        body: JSON.stringify({ users: data.users }),
      })
        .then((res) => res.json())
        .then((data) => showBookDetail(data));
    });
};
