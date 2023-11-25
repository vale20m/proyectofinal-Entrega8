// Direcciones de donde sacamos los archivos .JSON

const CATEGORIES_URL = "http://localhost:3000/cats";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell";
const PRODUCTS_URL = "http://localhost:3000/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments/";
const CART_INFO_URL = "http://localhost:3000/user_cart";
const EXT_TYPE = ".json";

// Direcciones en las cuales manejamos las bases de datos

const LOGIN_URL = "http://localhost:3000/login/";
const COMMENTS_URL = "http://localhost:3000/comments/";
const WISHLIST_URL = "http://localhost:3000/wishlist/";
const CART_URL = "http://localhost:3000/cart/";
const ID_PURCHASE_URL = "http://localhost:3000/id_purchase/";


let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}


// Constantes para entrega 4 funcionalidad 2 (menu desplegable)

const loginButton = document.querySelector("#loginButton");
const profile = document.querySelector("#profile");
const options = document.querySelector("#profile-options");
const userDropdown = document.querySelector("#userDropdown");

// Funciones para cambiar entre modo claro y modo oscuro

const switchMode = document.querySelector("#switchMode");
const whiteItems1 = document.getElementsByClassName("shadow");
const whiteItems2 = document.getElementsByClassName("card");
const cartItemsText = document.querySelectorAll("#cartItems");
const cartTitleText = document.querySelectorAll("#cartTitle");
const blackContainer = document.getElementById("black1");

// Función que cambia el color del fondo de la pagina actual

// Tenemos en cuenta los items blancos de la página

function changeBackground(){


  if (localStorage.getItem("screenMode") == undefined || localStorage.getItem("screenMode") == "light"){

    document.body.classList.remove("bg-dark", "text-white");
    switchMode.innerHTML = "Modo noche";

    for (const item of whiteItems1) {
      item.classList.remove("text-dark");
    }
    for (const item of whiteItems2) {
      item.classList.remove("text-dark");
    }
    for (const item of cartItemsText) {
      item.style.color = "";
    }
    for (const item of cartTitleText) {
      item.style.color = ""; 
    }
    if (blackContainer) {
      blackContainer.classList.remove("bg-dark");
    }

    return;
    
  }
  
  if (localStorage.getItem("screenMode") == "dark"){

    document.body.classList.add("bg-dark", "text-white");
    switchMode.innerHTML = "Modo día";

    for (const item of whiteItems1) {
      item.classList.add("text-dark");
    }
    for (const item of whiteItems2) {
      item.classList.add("text-dark");
    }
    for (const item of cartItemsText) {
      item.style.color = "white";
    }
    for (const item of cartTitleText) {
      item.style.color = "white";
    }

    if (blackContainer) {
      blackContainer.classList.add("bg-dark");
    }
    
  }
}

switchMode.addEventListener("click", function(){
    
  if (localStorage.getItem("screenMode") == undefined || localStorage.getItem("screenMode") == "light"){

    localStorage.setItem("screenMode", "dark");

  } else {

    localStorage.setItem("screenMode", "light");

  }

  changeBackground();

});

document.addEventListener("DOMContentLoaded", function(){

  changeBackground();

  // Función para mostrar el nombre del usuario, el cierre de sesion y el redireccionar al login (si no ha iniciado sesión)

  if(localStorage.getItem("email") == undefined){

    profile.innerHTML = "Redireccionando en 3...";
    for (let a = 2; a >= 1; a--){
        setTimeout( () => profile.innerHTML = "Redireccionando en " + a + "...", 2000/a);
    }
    setTimeout( () => window.location.replace('login.html'), 3000);

    // Ocultamos los elementos del menu desplegable y le quitamos la clase (para retirar la flecha)

    options.style.display = "none";
    userDropdown.classList.remove("dropdown-toggle");

  } else {

    profile.innerHTML = localStorage.getItem("email");
    loginButton.addEventListener("click", function(){
        localStorage.clear();
        loginButton.href = "index.html";
    });

    // Le agregamos la clase al menu desplegable

    userDropdown.classList.add("dropdown-toggle");

  }

});