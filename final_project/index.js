const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Mecanismo de autenticación intermedio (Middleware)
app.use("/customer/auth/*", function auth(req, res, next) {
    // Verificar si el usuario tiene un token almacenado en la sesión
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        
        // Verificar la validez del token JWT
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Guardar los datos del usuario en la solicitud
                next(); // Continuar al siguiente endpoint protegido
            } else {
                return res.status(403).json({ message: "Usuario no autenticado o token vencido." });
            }
        });
    } else {
        return res.status(403).json({ message: "Por favor, inicia sesión para acceder." });
    }
});
 
const PORT = 8800;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Servidor corriendo perfectamente en el puerto " + PORT));