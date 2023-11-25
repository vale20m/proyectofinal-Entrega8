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
        setUser(LOGIN_URL, {email:createEmail.value, password:createPassword1.value});
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
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });

        const responseContents = await response.json();

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





// Funciones para el manejo del Change Password

const changePasswordForm = document.querySelector("#changePasswordForm");
const emailChangePassword = document.querySelector("#emailChangePassword");
const newPassword = document.querySelector("#newPassword");
const openModalChangePassword = document.querySelector("#openModalChangePassword");

// Función para mostrar y ocultar la contraseña en el change password

const showNewPassword = document.querySelector("#showNewPassword");

showNewPassword.addEventListener("change", function(){

    if (showNewPassword.checked){
        newPassword.type = "text";
    } else {
        newPassword.type = "password";
    }

});

// Función para modificar la contraseña del usuario

changePasswordForm.addEventListener("submit", function(event){

    if(!changePasswordForm.checkValidity()){
        event.preventDefault();
        event.stopPropagation();
    }

    changePasswordForm.classList.add("was-validated");

    if (emailChangePassword.checkValidity() && newPassword.checkValidity()){
        changePassword(LOGIN_URL, {email: emailChangePassword.value, password: newPassword.value});
    }

    event.preventDefault();

});

// Funcion que modifica la contraseña de la cuenta especificada en la base de datos (vía el método PUT)

async function changePassword(url, user){

    try {
        
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });

        const responseContents = await response.json();

        const changePasswordModal = document.querySelector("#changePassword")

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
            Has modificado la contraseña exitosamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

            setTimeout(() => {
                location.reload();
            }, "2000");

        }

        changePasswordModal.appendChild(message);

    } catch (error) {
        console.log(error.message);
    }

}





// Funciones para el manejo del LOGIN

const loginForm = document.querySelector("#loginForm");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const sendLogin = document.querySelector("#sendLogin");
const openModalSignIn = document.querySelector("#openModalSingIn");

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

        const message = document.createElement("div");
        const user = await searchUser(LOGIN_URL + email.value);

        if (user.password == password.value){

            message.innerHTML =
            `<div class="text-center alert alert-success alert-dismissible fade show" role="alert">
            Has iniciado sesion exitosamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

            document.body.appendChild(message);

            localStorage.setItem("email", email.value);
            const token = await getToken(LOGIN_URL + "verify", {email: email.value, password: password.value});
            localStorage.setItem("token", token);
            sendLogin.disabled = true;
            openModalSignIn.disabled = true;
            openModalChangePassword.disabled = true;
            setTimeout(() => {
                window.location.href = "index.html";
            }, "2000");

        } else {

            if (user.message != undefined){
                message.innerHTML =
                `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
                    ${user.message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
            } else {
                message.innerHTML =
                `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
                    La contraseña es incorrecta.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
            }

            document.body.appendChild(message);
        
        }

    }

});

async function searchUser(url){

    try {
        
        const response = await fetch(url);

        const responseContents = await response.json();

        return responseContents;

    } catch (error) {
        console.log(error.message);
    }

}

// Realizamos un fetch con el método POST para conseguir un token de verificación

async function getToken(url, user){

    try {
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });

        const responseContents = await response.json();

        return responseContents.token;

    } catch (error) {
        console.log(error.message);
    }

}