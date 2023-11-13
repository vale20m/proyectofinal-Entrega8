/* Guardamos el valor de la categoría a la que ingresa el usuario
(establecida en el localStorage) y la incluimos en la URL de la API.
También definimos un "acceso" (container) a la ubicacion en la que guardaremos
los elementos extraidos de la API */

let CategoryNum = localStorage.getItem("catID");

let DATA_product = "https://japceibal.github.io/emercado-api/cats_products/" + CategoryNum + ".json";

const container = document.getElementById("info");

/* Entrega 3: Función para redireccionar al usuario a "product-info.html" una vez
   seleccione un product */

function selectProduct(productID){
  localStorage.setItem("productID", productID);
  window.location = "product-info.html";
}

/* Establecemos la estructura con la que se van a incluir los products de la
API en el documento HTML */

/* Para la entrega 3 agregamos una funcion "onclick" a la tabla que muestra cada product,
   que ejecuta la funcion "selectProduct" */

function showData(dataArray) {
  // El for itera sobre los elementos del array
  container.innerHTML = "";
  for (const item of dataArray) {
    let imagen = item.image;
    container.innerHTML +=  `
    <h3 class="mt-4">${item.name}</h3>
    <table border="25" class="auto-table list-group" onclick="selectProduct(${item.id})">
        <tr class="row">
            <td class="col-md-5 col-12 my-auto"><img src="${imagen}" alt="${item.name}" class="img-thumbnail"></td> 
            <td class="col-md-2 col-sm-3 offset-sm-0 col-10 offset-1 my-auto"><h4>Costo</h4> ${item.currency}  -  ${item.cost}</td>
            <td class="col-md-3 col-sm-6 offset-sm-0 col-10 offset-1 my-auto"><h4>Info: </h4>${item.description}</td>
            <td class="col-md-2 col-sm-3 my-auto text-center d-sm-block d-none"><small>Vendidos: ${item.soldCount}</small></td>
        </tr>
    </table>`;
  }
}

let productsArray = [];

let maxPrice = 0;
let minPrice = Infinity;

function modifyPrice(product){
    if(maxPrice < product.cost){
      maxPrice = product.cost;
    }
    if(minPrice > product.cost){
      minPrice = product.cost;
    }
}

function saveProducts(array){
  for (const product of array){
    modifyPrice(product);
    productsArray.push(product);
  }
}

// Realizamos la llamada a través del fetch para obtener la información de la API

// Creamos una variable para guardar los products

const categoryContainer = document.querySelector(".lead");

async function getData (url){

  try {
    
    let response = await fetch(url);
    let responseContents = await response.json();

    // Agregamos los products al arreglo "productsArray" la funcion "saveProducts";
    saveProducts(responseContents.products);

    showData(responseContents.products);

    const category = responseContents.catName;
    categoryContainer.innerHTML += `Aqui podes ver todos nuestros  <u>${category}</u>`

  } catch (error) {

    const message = document.createElement("div");
    message.innerHTML =
    `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
      HTTP ERROR: ${error.message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

    document.body.appendChild(message);

  }
}

getData(DATA_product);

let filteredProducts = productsArray;

// Desarrollamos el código para filtrar los products

// Botones de orden (ascendente, descendente y por cantidad):

const sortDescButton = document.querySelector("#sortDesc");
const sortAscButton = document.querySelector("#sortAsc");
const sortSoldCountButton = document.querySelector("#sortByRel");

sortDescButton.addEventListener("click", function(){
  filteredProducts = productsArray.sort((product1, product2) => product2.cost - product1.cost);
  showData(filteredProducts);
});

sortAscButton.addEventListener("click", function(){
  filteredProducts = productsArray.sort((product1, product2) => product1.cost - product2.cost);
  showData(filteredProducts);
});

sortSoldCountButton.addEventListener("click", function(){
  filteredProducts = productsArray.sort((product1, product2) => product2.soldCount - product1.soldCount);
  showData(filteredProducts);
});

// Casillas de cantidad (a elección):

const minPriceInput = document.querySelector("#rangeFilterPriceMin");
const maxPriceInput = document.querySelector("#rangeFilterPriceMax");

// Botones para filtrar y limpiar busqueda (en relacion a las casillas anteriores):

const filter = document.querySelector("#rangeFilterPrice");
const clear = document.querySelector("#clearRangeFilter");

filter.addEventListener("click", function(){
  if (minPriceInput.value <= maxPrice && minPriceInput.value >= 0 && maxPriceInput.value == ""){
    filteredProducts = productsArray.filter((product) => (product.cost >= minPriceInput.value));
  } else
  if (maxPriceInput.value >= minPrice && minPriceInput.value == ""){
    filteredProducts = productsArray.filter((product) => (product.cost <= maxPriceInput.value));
  } else
  if (maxPriceInput.value >= minPriceInput.value && maxPriceInput.value >= minPrice && minPriceInput.value <= maxPrice && minPriceInput.value >= 0){
    filteredProducts = productsArray.filter((product) => (product.cost >= minPriceInput.value && product.cost <= maxPriceInput.value));
  }
  showData(filteredProducts);
});

clear.addEventListener("click", function(){
  maxPriceInput.value = "";
  minPriceInput.value = "";
  showData(productsArray);
  filteredProducts = productsArray;
});

// Agregamos las funciones para la barra de busqueda

const searchBar = document.querySelector("#searchBar");

// El evento "input" se activa cuando se modifica el valor de la barra de busqueda

searchBar.addEventListener("input", function(){
  const searchedProducts = filteredProducts.filter((product) => (product.name.toLowerCase().includes(searchBar.value.toLowerCase()) || product.description.toLowerCase().includes(searchBar.value.toLowerCase())));
  showData(searchedProducts);
});