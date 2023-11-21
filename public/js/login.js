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

    if (!signInForm.checkValidity()){
        event.preventDefault();
        event.stopPropagation();
    }

    signInForm.classList.add("was-validated");

    createPassword2.addEventListener("input", function(){
        if (createPassword1.value == createPassword2.value && createPassword2.checkValidity()){
            createPassword2.classList.add("is-valid");
            createPassword2.classList.remove("is-invalid");
        } else {
            createPassword2.classList.add("is-invalid");
            createPassword2.classList.remove("is-valid");
        }
    });

    if (verifyUser()){
        setUser("http://localhost:3000/login", {email:createEmail.value, password:createPassword1.value});
    }

    event.preventDefault();

});

function verifyUser(){

    if (createEmail.checkValidity() && createPassword1.checkValidity() && createPassword2.checkValidity() && createPassword1.value == createPassword2.value){
        return true;
    } else {
        return false;
    }

}

// Función que envia una solicitud POST a la direccion "http://localhost:3000/login" para agregar un nuevo usuario

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

        const signInModal = document.querySelector("#signInModal");
        
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

            setTimeout(() => {
                location.reload();
            }, "2000");
        
        }

        signInModal.appendChild(message);

    } catch (error) {
        console.log(error.message);
    }

}


// Funciones para el manejo del LOGIN

const loginForm = document.querySelector("#loginForm");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const sendLogin = document.querySelector("#sendLogin");
const openModal = document.querySelector("#openModal");

// Función para mostrar y ocultar la contraseña en el login

const showPasswordLogin = document.querySelector("#showPassword");

showPasswordLogin.addEventListener("change", function(){

    if (showPasswordLogin.checked){
        password.type = "text";
    } else {
        password.type = "password";
    }

});

sendLogin.addEventListener("click", async function(event){

    if (!loginForm.checkValidity()){
        event.preventDefault();
        event.stopPropagation();
    }

    loginForm.classList.add("was-validated");

    event.preventDefault();

    if (loginForm.checkValidity()){
        const bool = await searchUser(`http://localhost:3000/login/${email.value}/${password.value}`);
        if (bool){
            localStorage.setItem("email", email.value);
            sendLogin.disabled = true;
            openModal.disabled = true;
            setTimeout(() => {
                window.location.href = "index.html";
            }, "2000");
        }
    }

});

async function searchUser(url){

    try {
        
        let response = await fetch(url);

        let responseContents = await response.json();

        const message = document.createElement("div");

        if (responseContents.email == undefined){

            message.innerHTML =
            `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
            ${responseContents.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

            document.body.appendChild(message);

            return false;

        } else {

            message.innerHTML =
            `<div class="text-center alert alert-success alert-dismissible fade show" role="alert">
            Has iniciado sesion exitosamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

            document.body.appendChild(message);

            return true;
        
        }

    } catch (error) {
        console.log(error.message);
    }

    return false;

}