const axios = require('axios');

const BASE_URL = "http://localhost:8800";

// Tarea 10: Obtener todos los libros usando Promesas de Axios
function getAllBooks() {
    axios.get(`${BASE_URL}/`)
        .then(response => {
            console.log("\n--- Tarea 10: Lista Completa de Libros (Promesa) ---");
            console.log(response.data);
        })
        .catch(error => console.error("Error al obtener libros:", error.message));
}

// Tarea 11: Obtener detalles del libro por ISBN usando Promesas de Axios
function getBookByISBN(isbn) {
    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => {
            console.log(`\n--- Tarea 11: Detalles del Libro ISBN ${isbn} (Promesa) ---`);
            console.log(response.data);
        })
        .catch(error => console.error("Error por ISBN:", error.message));
}

// Tarea 12: Obtener libros por Autor usando Async/Await con Axios
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        console.log(`\n--- Tarea 12: Libros del Autor '${author}' (Async/Await) ---`);
        console.log(response.data);
    } catch (error) {
        console.error("Error por Autor:", error.message);
    }
}

// Tarea 13: Obtener libros por Título usando Async/Await con Axios
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`${BASE_URL}/title/${title}`);
        console.log(`\n--- Tarea 13: Libros con el Título '${title}' (Async/Await) ---`);
        console.log(response.data);
    } catch (error) {
        console.error("Error por Título:", error.message);
    }
}

// Ejecutar todas las funciones para probar el asincronismo
getAllBooks();
getBookByISBN(1);
getBooksByAuthor("Chinua Achebe");
getBooksByTitle("Fairy tales");