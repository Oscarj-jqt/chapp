// Importer Express et les modules nécessaires
const express = require("express");
const path = require("path");

// Initialisation de l'application Express
const app = express();

// Créer un serveur HTTP à partir de l'application Express
const server = require("http").createServer(app);

// Initialiser Socket.IO sur le serveur
const io = require("socket.io")(server);

//Liaison des fichiers statiques (express, styles, js...) dans le dossier public
app.use(express.static(path.join(__dirname+"/public")));

// Gérer les connexions de Socket.IO
io.on("connection", function(socket) {

    // Lorsque l'utilisateur rejoint, diffuser l'événement 'newUser' aux autres
    socket.on("newUser", function(username){
        socket.broadcast.emit("update", username + " a rejoint la conversation");
    });

    // Lorsque l'utilisateur quitte, diffuser l'événement 'exituser' aux autres
    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " a quitté la conversation");
    });

    // Lorsque l'utilisateur envoie un message, le transmettre aux autres utilisateurs
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
});

server.listen(5000);