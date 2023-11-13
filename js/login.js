// Función para mostrar y ocultar contraseña

const showPassword = document.querySelector("#showPassword");

showPassword.addEventListener("change", function(){
    if (showPassword.checked){
        password.type = "text";
    } else {
        password.type = "password";
    }
});

// Función para guardar el "user" y el email del usuario

const form = document.querySelector("#form");
const email = document.querySelector("#email");

form.addEventListener('submit', function(event){
    localStorage.setItem("email", email.value);

     event.preventDefault();
     window.location.href = "index.html";
});