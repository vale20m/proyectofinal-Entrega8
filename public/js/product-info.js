/* Entrega 3: Para acceder correctamente a la informacion del producto seleccionado, guardamos su ID en una
   variable y la anidamos al resto de la URL */

const ProductNum = localStorage.getItem("productID");

const userEmail = localStorage.getItem("email");

// "Traemos" utilizando el DOM el div de id "productInfo" para colocar la información en él

const container = document.getElementById("productInfo");

const relatedProducts = document.getElementById("relatedProducts");

function showData(product) {
  container.innerHTML += `
  <div class="row col-11 mx-auto"><h1 class="my-3 text-uppercase col-lg-8 col-md-7 col-12">${product.name}</h1>
  <div class="col-lg-1 col-md-2 col-3"><a role="button" id="wishlist" class="fs-1 btn mt-lg-0 mt-md-3">❤</a></div>
  <button id="buyProduct" type="button" class="btn btn-primary fs-3 col-md-3 col-9 my-auto">Comprar</button></div>
  <div><a class="text-secondary" href="index.html">Inicio ></a><a class="text-secondary" href="categories.html">Categorías ></a><a class="text-secondary" href="products.html">${product.category}</a></div> <hr>
  <p class="fs-3 shadow p-3 mb-3 mt-4 bg-body rounded fst-italic">${product.description}<p>
  <h2 class="shadow p-3 my-3 bg-body rounded">Precio: ${product.currency} ${product.cost}</h2>
  <h2 class="shadow p-3 mb-5 bg-body rounded">Ventas: ${product.soldCount} </h2>
  <p class="fs-4">Imágenes meramente ilustrativas: </p> <br>`;

  // Carrusel de imágenes
  const carouselInner = document.querySelector("#productImageCarousel .carousel-inner");

  for (let i = 0; i < product.images.length; i++) {
    const isActive = i === 0 ? 'active' : '';
    carouselInner.innerHTML += `
      <div class="carousel-item ${isActive}">
        <img class="d-block w-100 mx-auto" id="productPictures" src="${product.images[i]}" alt="Imagen ${i + 1}">
      </div>`;
  }

  // LLAMAMOS A LA FUNCION PARA MOSTRAR LOS PRODUCTOS RELACIONADOS

  showRelatedProducts(product);

}


// FUNCION PARA MOSTRAR LOS PRODUCTOS RELACIONADOS

function showRelatedProducts(product){
  
  // MOSTRAMOS LOS PRODUCTOS RELACIONADOS CON EL PRODUCTO ACTUAL
  
  for (const related of product.relatedProducts) {

    relatedProducts.innerHTML += `<div class="col-sm-6 mt-3"><div class="card" onclick="getRelatedProduct(${related.id})">
    <img src="${related.image}" class="card-img-top">
    <div class="card-body">
    <h2 class="card-title mx-3 fst-italic">${related.name}</h2>
    </div></div></div>`;

  }

}

// FUNCION PARA MOSTRAR UNO DE LOS PRODUCTOS RELACIONADOS AL SELECCIONARLO

function getRelatedProduct(productID){
  localStorage.setItem("productID", productID);
  window.location = "product-info.html";
}

// FUNCION PARA CAMBIAR EL COLOR DE FONDO

function changeBackground(){

  const whiteItems1 = document.getElementsByClassName("shadow");
  const whiteItems2 = document.getElementsByClassName("card");

  if (localStorage.getItem("screenMode") == "light" || localStorage.getItem("screenMode") == undefined){
  
    document.body.classList.remove("bg-dark", "text-white");
    switchMode.innerHTML = "Modo noche";

    for (const item of whiteItems1) {
      item.classList.remove("text-dark");
    }
    for (const item of whiteItems2) {
      item.classList.remove("text-dark");
    }

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

  }
}

// Función que permite tomar el producto actual y guardarlo en la base de datos al precionar "Comprar", asi como agregarlo a la Wishlist y cambiar el color de fondo adecuadamente

async function getProducts (url){

  try {

    let response = await fetch(url);
    let responseContents = await response.json();
    
    showData(responseContents);

    changeBackground();
    
    // GUARDAMOS EL BOTON DE COMPRAR EN UNA VARIABLE

    const buyProduct = document.querySelector("#buyProduct");

    // ANIDAMOS UN ADD EVENT LISTENER AL MISMO QUE SE ACTIVA CUANDO RECIBE UN CLICK Y GUARDA EL PRODUCTO EN EL LOCAL STORAGE

    buyProduct.addEventListener("click", async function(){

      // Chequeamos que el usuario haya iniciado sesion, y en caso de que no, le mostramos una alerta

      if (userEmail != undefined){

        const response = await saveProductProperties(CART_URL, {
          name: responseContents.name,
          unitCost: responseContents.cost,
          currency: responseContents.currency,
          image: responseContents.images[0],
          count: 1,
          id: responseContents.id,
          user: userEmail
        });

        const message = document.createElement("div");

        console.log(response);

        if (response.message == undefined){

          message.innerHTML = 
          `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
            El producto se ha agregado al carrito.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;

        } else {

          message.innerHTML = 
          `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
            ${response.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;

        }

        document.body.appendChild(message);

      } else {

        const message = document.createElement("div");
        message.innerHTML =
        `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
        Inicia sesión para agregar productos al carrito.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

        document.body.appendChild(message);

      }
    });

    const switchMode = document.querySelector("#switchMode");

    const wishlistButton = document.querySelector("#wishlist");

    // ADD EVENT LISTENER QUE ACTUALIZA EL BOTON DE CORAZON AL CAMBIAR EL MODO DE PANTALLA

    switchMode.addEventListener("click", function(){
      if (localStorage.getItem("screenMode") == undefined || localStorage.getItem("screenMode") == "light"){

        wishlistButton.classList.remove("darkModeHeart");

      } else {
        if (!wishlistButton.classList.contains("activeHeart")){
          wishlistButton.classList.add("darkModeHeart");
        }
      }
    });

    await checkActive(WISHLIST_URL + userEmail + "/" + responseContents.id, wishlistButton);

    // ADD EVENT LISTENER QUE AGREGA UN PRODUCTO A LA WISHLIST AL CLIQUEAR EL CORAZON (O LO QUITA SI YA ESTABA AGREGADO)

    wishlistButton.addEventListener("click", function(){

      // Chequeamos que el usuario haya iniciado sesion, y en caso de que no, le mostramos una alerta
      
      if (userEmail != undefined){

        if (!wishlistButton.classList.contains("activeHeart")){
          
          wishlistButton.classList.add("activeHeart");
          wishlistButton.classList.remove("darkModeHeart");
          
          saveWishlistProducts(WISHLIST_URL, {
            name: responseContents.name,
            cost: responseContents.cost,
            currency: responseContents.currency,
            image: responseContents.images[0],
            product: responseContents.id,
            user: userEmail
          });
        
        } else {
          
          checkLocalStorage(wishlistButton);
          wishlistButton.classList.remove("activeHeart");
          deleteWishlistProduct(WISHLIST_URL + userEmail + "/" + ProductNum);
        
        }

      } else {

        const message = document.createElement("div");
        message.innerHTML =
        `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
        Inicia sesión para agregar productos a la lista de deseados.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

        document.body.appendChild(message);

      }

    });

  } catch (error) {

    const message = document.createElement("div");
    message.innerHTML =
    `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
    HTTP ERROR: ${response.status}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

    document.body.appendChild(message);
    
  }
}

getProducts(PRODUCT_INFO_URL + ProductNum);



// CÓDIGO EN RELACIÓN A LOS COMENTARIOS DE LOS PRODUCTOS


// Obtener elementos del formulario

const commentText = document.getElementById("opinion");
const commentScore = document.getElementById("score");
const sendCommentButton = document.getElementById("sendComment");
const commentsContainer = document.getElementById("commentsContainer");



// Función para crear las estrellas

function showStars(score) {

  const starsContainer = document.createElement("span");

  // Creamos diferentes estrellas segun la puntuación

  for (let i = 1; i <= 5; i++) {

    const star = document.createElement("span");

    star.classList.add("fa", "fa-star");

    if (i <= score) {
      star.classList.add("text-warning");
    }

    starsContainer.appendChild(star);
  }

  return starsContainer;
}



// Función para establecer el estilo de los comentarios

function setComments(comment){

  const listItem = document.createElement("div");
  listItem.classList.add("list-group-item");

  // Crea un elemento para mostrar la puntuación en forma de estrellas

  const starsContainer = showStars(comment.score);

  const userElement = document.createElement("span");
  userElement.classList.add("fw-bold");
  userElement.textContent = comment.user;

  // Agrega el nombre de usuario, la fecha y las estrellas al elemento de lista

  const commentContent = ` - ${comment.dateTime} - `;
  listItem.appendChild(userElement);
  listItem.innerHTML += commentContent;
  listItem.appendChild(starsContainer);

  listItem.appendChild(document.createElement("br"));

  const commentElement = document.createElement("span");
  commentElement.classList.add("fw-light");
  commentElement.textContent = comment.description;

  listItem.appendChild(commentElement);

  // Agrega el elemento de lista al contenedor en la página

  commentsContainer.appendChild(listItem);

}




// Función para cargar comentarios desde una URL asociada al ID del producto

async function getProductComments(url) {

  const commentsURL = url + ProductNum;

  try {

    // Traemos los comentarios del JSON

    const responseJSON = await fetch(commentsURL);

    let comments = await responseJSON.json();

    // Traemos los comentarios de la base de datos

    const responseDB = await fetch(COMMENTS_URL + ProductNum);

    const commentsDB = await responseDB.json();


    if (commentsDB[0].message == undefined){
      for (const comment of commentsDB) {
        comments.push(comment);
      }
    }

    if (comments && comments.length > 0) {

      // Ordena los comentarios de más viejos a más nuevos por fecha

      comments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

      comments.forEach((comment) => {
        setComments(comment);
      });

    }

  } catch (error) {

    console.error("Error:", error);

    const message = document.createElement("div");
    message.innerHTML =
    `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
    Error al cargar los comentarios.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

    document.body.appendChild(message);

  }

}

// Llama a la función para cargar los commentarios desde la URL al cargar la página

getProductComments(PRODUCT_INFO_COMMENTS_URL);



// Agregar evento click al botón "Agregar"

sendCommentButton.addEventListener("click", async function () {

  // Chequeamos que el usuario haya iniciado sesion, y en caso de que no, le mostramos una alerta

  const message = document.createElement("div");

  if (userEmail != undefined){

    const dateTime = getActualDate();

    const score = parseInt(commentScore.value);

    const check = await postComment(COMMENTS_URL, {
      user: userEmail,
      dateTime: dateTime,
      score: score,
      description: commentText.value,
      product: ProductNum
    });

    if (check.message == undefined){

    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");

    // Crea un elemento para mostrar la puntuación en forma de estrellas

    const starsContainer = showStars(score);

    const userElement = document.createElement("span");
    userElement.classList.add("fw-bold");
    userElement.textContent = userEmail;

    // Agregar el correo del usuario, la fecha y las estrellas al elemento de lista

    const comment = ` - ${dateTime} - `;
    listItem.appendChild(userElement);
    listItem.innerHTML += comment;
    listItem.appendChild(starsContainer);

    listItem.appendChild(document.createElement("br"));

    const commentElement = document.createElement("span");
    commentElement.classList.add("fw-light", "text-break");
    commentElement.textContent = commentText.value;

    listItem.appendChild(commentElement);

    commentsContainer.appendChild(listItem);

    commentText.value = "";
    commentScore.value = 1;

    message.innerHTML =
    `<div class="text-center alert alert-success alert-dismissible fade show" role="alert">
    ¡Gracias por tu comentario!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

    } else {

      message.innerHTML =
      `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
      ${check.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

    }
  
  } else {

    message.innerHTML =
    `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
    Inicia sesión para comentar y puntuar productos.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

  }

  document.body.appendChild(message);

});

// Realizamos un fetch método POST para enviar el comentario a la base de datos

async function postComment(url, user){

  try {
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });

    const responseContents = await response.json();

    return responseContents;

  } catch (error) {
    console.log(error.message);
  }

}


// Función para obtener la fecha actual en un formato específico

function getActualDate() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");
  const hora = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const segundos = fecha.getSeconds().toString().padStart(2, "0");

  return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
}

// ENTREGA 5: FUNCIONALIDAD PARA GUARDAR PROPIEDADES DEL PRODUCTO SELECCIONADO EN EL LOCAL STORAGE
// NO LO GUARDA SI EL MISMO USUARIO INTENA GUARDAR EL MISMO ITEM

async function saveProductProperties(url, product) {

  try {
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product)
    });

    const responseContents = await response.json();

    return responseContents;

  } catch (error) {
    console.log(error.message);
  }

}

// Función que guarda un producto en la wishlist (Base de datos) cuando se presiona el corazón (si no esta agregado)

async function saveWishlistProducts(url, item) {
  
  try {
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item)
    });

    const responseContents = await response.json();

    return responseContents;

  } catch (error) {
    console.log(error.message);
  }

}

// Función que elimina un producto de la wishlist de un usuario (base de datos) cuando se presiona el corazón (si estaba en la wishlist)

async function deleteWishlistProduct(url){
  
  try {
    
    const response = await fetch(url, {
      method: "DELETE",
    });

    const responseContents = await response.json();

    return responseContents;

  } catch (error) {
    console.log(error.message);
  }

}

// FUNCION QUE ANALIZA SI EL PRODUCTO ACTUAL ESTA EN EL LOCAL STORAGE Y, EN CASO DE ESTAR, COLOREA EL CORAZON DE ROJO

async function checkActive (url, button){

  try {
    
    const response = await fetch(url);

    const responseContents = await response.json();

    if (responseContents.message == undefined){
      button.classList.add("activeHeart");
    } else {
      button.classList.remove("activeHeart");
    }

    checkLocalStorage(button);

    return responseContents;

  } catch (error) {
    console.log(message.error);
  }

}

// FUNCION QUE ANALIZA EL MODO DE PANTALLA ACTUAL, Y EN BASE A ESO CAMBIA EL COLOR DEL BOTON (SIN COLOREAR DE ROJO)

function checkLocalStorage(button){

  if (localStorage.getItem("screenMode") == "dark"){
    button.classList.add("darkModeHeart");
  } else {
    button.classList.remove("darkModeHeart");
  }

}