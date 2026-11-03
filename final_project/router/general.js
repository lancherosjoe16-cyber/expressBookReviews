const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 6: Registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const userExists = users.some((user) => user.username === username);
    if (!userExists) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Usuario registrado exitosamente. Ahora puedes iniciar sesión."});
    } else {
      return res.status(400).json({message: "El usuario ya existe."});    
    }
  } 
  return res.status(400).json({message: "No se proporcionó usuario o contraseña."});
});

// Tarea 1: Obtener la lista de todos los libros disponibles en la tienda
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 4));
});

// Tarea 2: Obtener los detalles del libro basados en el código ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Libro no encontrado por ISBN."});
  }
});
  
// Tarea 3: Obtener los detalles del libro basados en el Autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filteredBooks = {};
  
  Object.keys(books).forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({message: "No se encontraron libros de este autor."});
  }
});

// Tarea 4: Obtener todos los libros basados en el Título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filteredBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({message: "No se encontraron libros con este título."});
  }
});

// Tarea 5: Obtener las reseñas o comentarios de un libro concreto
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Libro no encontrado para ver reseñas."});
  }
});

module.exports = {
  general: public_users
};