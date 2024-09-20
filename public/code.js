(function(){

    // Sélection de l'élément principal de l'application
    const app = document.querySelector(".app");

    // Initialisation de Socket.IO côté client
    const socket = io();

    // Variable pour stocker le nom d'utilisateur
    let uname;

    // Gestionnaire d'événements pour rejoindre le chat
    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        // Récupérer le nom d'utilisateur entré
        let username = app.querySelector(".join-screen #username").value;

        // Rien ne se passe si le champ est vide
        if(username.length == 0) {
            return;
        }

        // Émettre l'événement 'newUser' avec le nom d'utilisateur au serveur
        socket.emit("newUser", username);

        // Sauvegarder le nom d'utilisateur dans la variable locale
        uname = username;

        // Masquer l'écran de connexion et afficher l'écran de chat et inversement
        //Sélection de l'élément et on enlève la classe
        app.querySelector(".join-screen").classList.remove("active");
        //ajout de la classe
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0) {
            return;
        }
        renderMessage("my", {
            username:uname,
            text:message
        });
        socket.emit("chat", {
            username:uname,
            text:message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    //Fonctionnalité pour quitter le chat
    //Sélection du bouton et event sur clique
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser", uname);
        //renvoi le user vers l'url de départ
        window.location.href = window.location.href;
    })

    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

    function renderMessage(type,message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
            <div>
                <div class="name">Toi</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        // scroll chat to end
        messageContainer.scorllTop = messageContainer.scrollHeight - messageContainer.clientHeight;

    }

})();