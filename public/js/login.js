// Funciones para el manejo del SIGNIN

const signInForm = document.querySelector("#signInForm");
const createEmail = document.querySelector("#createEmail");
const createPassword1 = document.querySelector("#createPassword1");
const createPassword2 = document.querySelector("#createPassword2");

// Funcion para mostrar y ocultar las contraseñas en el signin

const showPasswordSignin = document.querySelector("#showCreatePassword");

showPasswordSignin.addEventListener("change", function(){

    if (showPasswordSignin.checked){
        createPassword1.type = "text";
        createPassword2.type = "text";
    } else {
        createPassword1.type = "password";
        createPassword2.type = "password";
    }

});

// Función para crear un usuario en caso de que no exista en el sistema.

signInForm.addEventListener('submit', function(event){

    event.preventDefault();
    event.stopPropagation();
    
    setUser("http://localhost:3000/users", {email:email.value, password:password.value});


    // window.location.href = "index.html";

});

// Función que envia una solicitud POST a la direccion "http://localhost:3000/users" para agregar un nuevo usuario

async function setUser (url, user){
    
    try {
        
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });

        let responseContents = await response.json();
        
        const message = document.createElement("div");

        if (responseContents.email == undefined){

            message.innerHTML =
            `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
            ${responseContents.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        } else {

            message.innerHTML =
            `<div class="text-center alert alert-success alert-dismissible fade show" role="alert">
            La cuenta fue creada con éxito.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

            localStorage.setItem("email", responseContents.email);
        
        }

        document.appendChild(message);

    } catch (error) {
        
        console.log(error.message);

    }

}


// Funciones para el manejo del LOGIN

const loginForm = document.querySelector("#loginForm");

// Función para mostrar y ocultar la contraseña en el login

const showPasswordLogin = document.querySelector("#showPassword");

showPasswordLogin.addEventListener("change", function(){

    if (showPasswordLogin.checked){
        password.type = "text";
    } else {
        password.type = "password";
    }

});