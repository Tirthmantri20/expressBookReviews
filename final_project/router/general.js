const express = require("express");
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if(username && password){

    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } 
    else {
      return res.status(404).json({message: "User already exists!"});
    }

  }

  return res.status(404).json({message: "Unable to register user."});
});



// Get the book list available in the shop
public_users.get('/asyncbooks', async function (req, res) {

  try {
    const response = await axios.get("http://localhost:5001/books");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }

});

// Get book details based on ISBN
public_users.get('/asyncisbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  axios.get("http://localhost:5001/books")
  .then(response => {
    const book = response.data[isbn];
    res.status(200).json(book);
  })
  .catch(err => {
    res.status(500).json({message: "Error retrieving book"});
  });

});

// Get book details based on author
public_users.get('/asyncauthor/:author', async function (req, res) {

  const author = req.params.author;

  try {

    const response = await axios.get("http://localhost:5001/books");
    const booksData = response.data;

    let result = {};

    Object.keys(booksData).forEach(key => {
      if (booksData[key].author === author) {
        result[key] = booksData[key];
      }
    });

    return res.status(200).json(result);

  } catch(error) {
    return res.status(500).json({message: "Error retrieving books"});
  }

});

// Get all books based on title
public_users.get('/asynctitle/:title', function (req, res) {

  const title = req.params.title;

  axios.get("http://localhost:5001/books")
  .then(response => {

    const booksData = response.data;
    let result = {};

    Object.keys(booksData).forEach(key => {
      if (booksData[key].title === title) {
        result[key] = booksData[key];
      }
    });

    res.status(200).json(result);

  })
  .catch(error => {
    res.status(500).json({message: "Error retrieving books"});
  });

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
