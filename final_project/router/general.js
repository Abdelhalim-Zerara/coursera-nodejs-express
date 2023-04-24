const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const user = { username, password };
  users.push(user);

  return res.status(201).json({ message: "User created successfully", user });
});

// Get the book list available in the shop 
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 2));
});

// Get the book list available in the shop (Promise)
public_users.get('/books',function (req, res) {

  const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    res.status(200).send(JSON.stringify(book, null, 2));
  } else {
    res.status(404).send('Book not found');
  }
 });

// Get book details based on ISBN (Promise)
public_users.get('/books/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookPromise = new Promise((resolve, reject) => {
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (book) {
      resolve(book);
    } else {
      reject('Book not found');
    }
  });

  bookPromise
    .then(book => res.status(200).send(JSON.stringify(book, null, 2)))
    .catch(error => res.status(404).send(error));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  console.log(author);
  const bookList = [];
  for (let bookId in books) {
      if (books.hasOwnProperty(bookId)) {
          let book = books[bookId];
          if (book.author.toLowerCase() === author) {
              bookList.push(book);
          }
      }
  }
  if (bookList.length>0) {
    res.status(200).send(JSON.stringify(bookList, null, 2));
  } else {
    res.status(404).send('Books not found');
  }
});

// Get book details based on author (Promise)
public_users.get('/books/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  new Promise((resolve, reject) => {
    const bookList = Object.values(books).filter(book => book.author.toLowerCase() === author);
    if (bookList.length > 0) {
      resolve(bookList);
    } else {
      reject('Books not found');
    }
  })
  .then(bookList => {
    res.status(200).send(JSON.stringify(bookList, null, 2));
  })
  .catch(error => {
    res.status(404).send(error);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title.toLowerCase();
  let bookList = [];
  for (let book in books) {
    if (books[book]['title'].toLowerCase()=== title) {
      bookList.push(books[book]);
    }
  }
  if (bookList.length > 0) {
    res.status(200).send(JSON.stringify(bookList, null, 2));
  } else {
    res.status(404).send('No books found with the given title.');
  }
});

// Get all books based on title (Promise)
public_users.get('/books/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const bookList = Object.values(books).filter(book => book.title.toLowerCase() === title);
    if (bookList.length > 0) {
      resolve(bookList);
    } else {
      reject('No books found with the given title.');
    }
  })
  .then(bookList => {
    res.status(200).send(JSON.stringify(bookList, null, 2));
  })
  .catch(error => {
    res.status(404).send(error);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    res.status(200).send(JSON.stringify(book.reviews, null, 2));
  } else {
    res.status(404).send('Book not found');
  }
});

module.exports.general = public_users;
