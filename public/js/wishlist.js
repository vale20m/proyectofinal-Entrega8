const wishlistItems = document.querySelector("#wishlistItems");

// FUNCION QUE DETERMINA COMO SE MUESTRAN LOS PRODUCTOS EN LA WISHLIST

function showWishlistedItems(array){

    wishlistItems.innerHTML = 
    `<h1 class="mt-3 mb-5">Actualmente, tienes los siguientes productos en tu lista de deseados:</h1>`

    for (const item of array) {

        // LOS PRODUCTOS SE MUESTRAN EN FORMATO "LIST-GROUP"
        
        const div = document.createElement("div");
        div.innerHTML =
        
        `<div class="w-75 mx-auto list-group-item list-group-item-action cursor-active border rounded">
            <div class="row my-1 mx-2 position-relative" onclick="showProduct(${item.product})">
                <img class="col-md-5 offset-md-0 col-10 offset-1 mt-2 mb-1 img-thumbnail" src="${item.image}">
                <div class="col-md-4 offset-md-0 col-11 offset-1 my-auto py-1 fs-4">${item.name}</div>
                <div class="col-md-3 offset-md-0 col-11 offset-1 my-auto py-1 fs-4">Precio: ${item.currency} ${item.cost}</div>
            </div>
            <button type="button" id="closeButton" class="close btn position-absolute top-0 end-0" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>`;

        const closeButton = div.querySelector("#closeButton");

        // AddEventListener que elimina un producto de la wishlist (base de datos) de un usuario cuando se presiona el boton "cerrar"

        closeButton.addEventListener("click", function(){
            div.innerHTML = "";
            deleteItems(WISHLIST_URL + item.user + "/" + item.product);
        });

        wishlistItems.appendChild(div);
    }

}

// FUNCION QUE LLEVA A LA PAGINA "PRODUCT-INFO.HTML" AL CLIQUEAR UN PRODUCTO

function showProduct(productID){
    localStorage.setItem("productID", productID);
    window.location = "product-info.html";
}

// Función que muestra los items de la wishlist del usuario (en caso de que los hayan) o un mensaje

async function showItems(url){

    // Mostramos los items del usuario actual

    try {

        const response = await fetch(url);

        const responseContents = await response.json();
        
        // Si el usuario actual tiene items en la lista, se muestran, y si no, se muestra un mensaje

        if (responseContents[0].message != undefined){
            wishlistItems.innerHTML = `<h1 class="mt-3">Actualmente no hay productos en la lista de deseados</h1>`;
        } else {
            showWishlistedItems(responseContents);
        }

    } catch (error) {
        console.log(error.message);
    }

}

showItems(WISHLIST_URL + localStorage.getItem("email"));

// Función que elimina un producto de la wishlist del usuario (base de datos)

async function deleteItems(url){

    try {
        
        const response = await fetch(url, {
            method: "DELETE"
        });

        const responseContents = response.json();

        return responseContents;

    } catch (error) {
        console.log(error.message);
    }

}