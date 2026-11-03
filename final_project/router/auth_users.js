const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"joe_test","password":"password123"}];

const isValid = (username)=>{ 
    // Retorna true si el usuario es válido (no está vacío)
    return username && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{
    // Comprueba si el usuario y la contraseña coinciden con los registros
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

// Tarea 7: Iniciar sesión como usuario registrado
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error al iniciar sesión: faltan credenciales."});
  }

  if (authenticatedUser(username, password)) {
    // Generar el token de acceso JWT
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    
    // Almacenar el token en la sesión de la solicitud
    req.session.authorization = { accessToken, username };
    
    return res.status(200).send("Usuario inició sesión exitosamente.");
  } else {
    return res.status(208).json({message: "Inicio de sesión inválido. Verifica tus credenciales."});
  }
});

// Tarea 8: Añadir o modificar una reseña de un libro
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];

  if (!books[isbn]) {
      return res.status(404).json({message: "Libro no encontrado."});
  }

  if (!review) {
      return res.status(400).json({message: "Por favor proporciona un texto para la reseña."});
  }

  // Añadir o actualizar la reseña bajo el nombre del usuario conectado
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({message: `La reseña del usuario ${username} para el libro con ISBN ${isbn} ha sido guardada/actualizada.`});
});

// Tarea 9: Eliminar la reseña de un libro basada en el usuario de la sesión
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];

  if (!books[isbn]) {
      return res.status(404).json({message: "Libro no encontrado."});
  }

  if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: `La reseña del usuario ${username} para el libro con ISBN ${isbn} ha sido eliminada.`});
  } else {
      return res.status(404).json({message: "No se encontró ninguna reseña tuya para este libro."});
  }
});

module.exports = {
  authenticated: regd_users,
  isValid: isValid,
  users: users
};