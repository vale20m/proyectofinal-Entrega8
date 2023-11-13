const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

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


// CONSTANTES PARA ENTREGA 4 FUNCIONALIDAD 2 (MENU DESPLEGABLE)

const loginButton = document.querySelector("#loginButton");
const profile = document.querySelector("#profile");
const options = document.querySelector("#profile-options");
const userDropdown = document.querySelector("#userDropdown");

// CAMBIAR ENTRE MODO CLARO Y MODO OSCURO

const switchMode = document.querySelector("#switchMode");
const whiteItems1 = document.getElementsByClassName("shadow");
const whiteItems2 = document.getElementsByClassName("card");
const cartItemsText = document.querySelectorAll("#cartItems");
const cartTitleText = document.querySelectorAll("#cartTitle");
const blackContainer = document.getElementById("black1");

// CAMBIA EL COLOR DEL FONDO DE LA PAGINA ACTUAL

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

      // OCULTAMOS LOS ELEMENTOS DEL MENU DESPLEGABLE Y LE QUITAMOS LA CLASE (PARA RETIRAR LA FLECHA)

      options.style.display = "none";
      userDropdown.classList.remove("dropdown-toggle");

  } else {

      profile.innerHTML = localStorage.getItem("email");
      loginButton.addEventListener("click", function(){
          localStorage.removeItem("email");
          loginButton.href = "index.html";
      });

      // LE AGREGAMOS LA CLASE AL MENU DESPLEGABLE

      userDropdown.classList.add("dropdown-toggle");

  }

});