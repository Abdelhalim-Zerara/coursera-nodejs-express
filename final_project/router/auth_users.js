const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
const SECRET="xHg8L2jFzKt6nBcQ"


let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

function findBookKeyByISBN(isbn) {
  for (const key in books) {
    if (books[key].isbn === isbn) {
      return key;
    }
  }
  return -1; // If no match is found
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  // Check if user exists in the database
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  // Check if password is correct
  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  // Create and sign a JWT token
  const token = jwt.sign({ username: user.username },SECRET);
  // Set the token in a cookie and send it back in the response
  return res.status(200).json({ token, message: "Logged in successfully" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!username) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review not provided" });
  }

  const bookIndex = findBookKeyByISBN(isbn);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const book = books[bookIndex];
  

  if (!book.reviews[username]) {
    book.reviews[username] = review;

    return res.status(201).json({ message: "Review added successfully" });
  } else {
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }
  
  const bookIndex = findBookKeyByISBN(isbn);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  if (!books[bookIndex].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }
  
  delete books[bookIndex].reviews[username];
  
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
