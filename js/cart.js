// CONSTANTES PARA EL FUNCIONAMIENTO DE TODO EL CODIGO (URL Y CONTENEDORES DE HTML)

const URL_USER = "https://japceibal.github.io/emercado-api/user_cart/25801.json"

// API que tiene el valor de las divisas actualizado

const URL_CURRENCIES = "https://v6.exchangerate-api.com/v6/b0fca623d878533edbdf61b4/latest/USD";

const cartItems = document.querySelector("#cartItems");

const cartControls = document.querySelector("#cartControls");

// FUNCION QUE CALCULA EL SUBTOTAL DEL PRODUCTO EN EL CARRITO, MULTIPLICANDO SU
// PRECIO POR LACANTIDAD, Y AGREGANDO LA MONEDA AL COMIENZO (DEVOLVIENDO UN SITRING)

function calculateSubtotal(string, num1, num2){
    const x = num1 * num2;
    const subtotal = string + " " + x;
    return subtotal;
}

// Constantes para que el costo de la compra se actualice

const cartSubtotal = document.querySelector("#cartSubtotal");

const cartTotal = document.querySelector("#cartTotal");

const shipCost = document.querySelector("#shipCost");

// Función que calcula el subtotal de la compra

function calculateCartSubtotal(array){

  let cartSubtotal = 0;

  for (const product of array) {

    if (product.currency == "UYU"){

      cartSubtotal += Math.round((product.unitCost * product.count) / currencyValues);

    } else {

      cartSubtotal += product.unitCost * product.count;

    }

  }

  return cartSubtotal;

}

// Función que calcula el costo de envío de la compra

const shipType = document.querySelector("#shipType");

function calculateShipCost(num){

  if (shipType.value == "premium"){

    return Math.round(num * 0.15);

  } else if (shipType.value == "express"){

    return Math.round(num * 0.07);

  } else {

    return Math.round(num * 0.05);

  }

}

function updateQuantities(array){

  cartSubtotal.innerHTML = "USD " + calculateCartSubtotal(array);
  
  shipCost.innerHTML = "USD " + calculateShipCost(calculateCartSubtotal(array));

  cartTotal.innerHTML = "USD " + (calculateCartSubtotal(array) + calculateShipCost(calculateCartSubtotal(array)));
  
}


function showCart(array){

  // Agregamos un if para que las opciones de compra no se muestren si no hay items en el carrito
  if (array.length < 1){
    cartControls.classList.add("d-none");
  }

  // SECCIÓN QUE FUNCIONA COMO "TÍTULO" DE LA TABLA DEL CARRITO
  cartItems.innerHTML += 
  `<div class="row">
      <div class="col-md-3 d-md-block d-none"></div>
      <div class="col-md-3 d-md-block d-none">Nombre</div>
      <div class="col-md-2 d-md-block d-none">Costo</div>
      <div class="col-md-2 d-md-block d-none">Cantidad</div>
      <div class="col-md-2 d-md-block d-none">Subtotal</div>
  </div>`
  for (const item of array) {
    const div = document.createElement("div");
    const quantityInputId = `quantityInput_${item.id}`; // Crea un ID único para cada campo de cantidad
  
    // Crea el elemento div y agrega clases de validación y un mensaje de error
    div.innerHTML = `
      <div class="list-group-item border rounded">
        <div class="row mx-auto">
          <div class="col-md-2 col-sm-4 offset-sm-0 col-5 offset-1 my-auto">
            <img id="cartItemImage" class="img-thumbnail my-auto" src="${item.image}"></div>
          <h4 class="col-lg-2 col-md-3 col-sm-4 col-6 my-auto mx-auto">${item.name}</h4>
          <h4 class="col-md-2 col-sm-4 d-sm-block d-none my-auto">${item.currency} ${item.unitCost}</h4>
          <h4 class="d-md-none col-sm-3 offset-sm-0 col-5 offset-1 my-md-auto mt-sm-3 mt-3">Cantidad: </h4>
          <div class="col-md-2 col-sm-3 col-6 my-md-auto mt-3 mt-2">
            <input type="number" class="form-control w-75 ${item.count <= 0 ? 'is-invalid' : ''}" id="${quantityInputId}" value="${item.count}" min="1">
            <div class="invalid-feedback">La cantidad debe ser mayor que 0</div> <!-- Mensaje de error --></div>
          <h4 class="d-md-none col-sm-3 offset-sm-0 col-5 offset-1 my-md-auto mt-sm-3 mt-2">Subtotal: </h4>
          <h4 id="subtotal" class="col-md-2 col-sm-3 col-6 my-md-auto mt-2">${calculateSubtotal(item.currency, item.unitCost, item.count)}</h4></div>
        <button type="button" id="closeButton" class="close btn position-absolute top-0 end-0" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
      </div>`;


    // AGREGAMOS UN ADD EVENT LISTENER QUE SE ACTIVA CUANTO SE HACE CLICK EN EL BOTON "CERRAR"
    // DE UN ITEM DEL CARRITO, ELIMINANDOLO DEL LOCAL STORAGE

    const closeButton = div.querySelector("#closeButton");

    closeButton.addEventListener("click", function(){
      
      div.innerHTML = "";

      deleteCartProducts(item.id, cartArray);
        
    });

    // ANIDAMOS UN ADD EVENT LISTENER AL ELEMENTO "INPUT", EL CUAL EJECUTA UNA FUNCION
    // QUE MODIFICA EL SUBTOTAL DEL PRODUCTO CADA VEZ QUE SE MODIFICA EL VALOR DE DICHO INPUT.

    const inputCount = div.querySelector("input");

    inputCount.addEventListener("input", function(){

      let change = false;

      const newCount = inputCount.value;
      if (newCount < 0){
        inputCount.value = 0;
        return;
      }

      const subtotalContainer = div.querySelector("#subtotal");
      subtotalContainer.textContent = calculateSubtotal(item.currency, item.unitCost, newCount);
      
      // TAMBIEN MODIFICAMOS LA CANTIDAD DEL ARTICULO Y LO ACTUALIZAMOS EN EL LOCAL STORAGE
      
      for (let i = 0; i < array.length-1; i++){
        if (array[i+1].id == item.id && array[i+1].username == localStorage.getItem("email")){
            array[i+1].count = newCount;
            change = true;
          }
      }

      if (!change){
        array[0].count = newCount;
      }

      localStorage.setItem("cartItems", JSON.stringify(array));

      // Modificamos el valor del subtotal, el costo de envío y el total del carrito
    
      updateQuantities(array);

    });

    // AGREGAMOS EL ELEMENTO A HTML
    cartItems.appendChild(div);
  }

  updateQuantities(array);

}

// Arreglo que contendrá todos los elementos del carrito

let cartArray = [];

// Variable que contendra los distintos cambios de varias monedas a peso uruguayo

let currencyValues;

async function getCart(url1, url2) {
  try {
    let responseItems = await fetch(url1);
    let responseContentsItems = await responseItems.json();

    // Reemplazamos los elementos en el arreglo cartArray con los nuevos elementos del servidor
    cartArray = responseContentsItems.articles;

    for (let i = 0; i < cartArray.length; i++){
      cartArray[i].username = localStorage.getItem("email");
    }

    // Creamos un array que carga los elementos del localStorage y los pasamos a cartArray

    const localItems = loadCartItems();

    if (localItems){
      // Agregamos los elementos del almacenamiento local al arreglo cartArray
      for (let i = 0; i < localItems.length; i++){
        if (localStorage.getItem("email") == localItems[i].username && localItems[i].id != cartArray[0].id){
          cartArray.push(localItems[i]);
        }
      }
    }

    localStorage.setItem("cartItems", JSON.stringify(cartArray));

    // Realizamos un segundo fetch a una API con el cambio de peso a dolar actualizado

    let responseCurrencies = await fetch(url2);
    let responseContentsCurrencies = await responseCurrencies.json();

    currencyValues = responseContentsCurrencies.conversion_rates.UYU;

    // LLAMAMOS A LA FUNCION PARA MOSTRAR LOS ELEMENTOS DEL CARRITO

    if (cartArray && cartArray != []){
      showCart(cartArray);
    } else {
      cartItems.innerHTML = `<h1 class="mt-5">Actualmente no hay productos en el carrito</h1>`
    }

  } catch (error) {
    console.log("HTTP ERROR: " + error.message);
  }
}

getCart(URL_USER, URL_CURRENCIES);

function loadCartItems() {
    const productsJSON = localStorage.getItem("cartItems");

    if (productsJSON) {
        const products = JSON.parse(productsJSON);
        return products;
    }
}

// FUNCION QUE ELIMINA UN ITEM DEL LOCAL STORAGE

function deleteCartProducts(id, array){
  for (let i = 0; i < array.length; i++){
    if (array[i].id == id && array[i].username == localStorage.getItem("email")){
      array.splice(i, 1);
      updateQuantities(array);
      localStorage.setItem("cartItems", JSON.stringify(array));
      return;
    }
  }
}

shipType.addEventListener("change", () => updateQuantities(cartArray));


// Entrega 6 - Funcionamiento del form

document.addEventListener('DOMContentLoaded', function () {




  // Guardamos en constantes los elementos de HTML que necesitamos para el funcionamiento del form

  const creditCard = document.getElementById('creditCard');
  const bankTransfer = document.getElementById('bankTransfer');
  const creditCardFields = document.getElementById("creditCardFields").getElementsByTagName("input");
  const bankTransferFields = document.getElementById("bankTransferFields").getElementsByTagName("input");


  // Función que actualiza el texto según la forma de pago elegida

  function updateSelectionText() {
    if (creditCard.checked) {
      selectionText.textContent = 'Tarjeta de crédito';
    } else if (bankTransfer.checked) {
      selectionText.textContent = 'Transferencia bancaria';
    } else {
      selectionText.textContent = 'No ha seleccionado';
    }
  }

  creditCard.addEventListener('change', updateSelectionText);
  bankTransfer.addEventListener('change', updateSelectionText);



  // Función que verifica el contenido de los campos de la opción "tarjeta de crédito"

  function validateNumberInput(field) {
    field.addEventListener('input', function () {

      // Eliminamos los caracteres no numéricos de los campos (utilizando expresiones regulares)
      let value = this.value.replace(/[^0-9]/, '');
      
      if (field.id == 'expirationDate') {

        // Añade un "/" luego de ingresar los meses de la fecha
        
        if (value.length > 2) {
          value = value.slice(0, 2) + '/' + value.slice(2);
        }
        
        // Elimina los caracteres sobrantes

        if (value.length > 5) {
          value = value.slice(0, 5);
        }

      }
      
      field.value = value;
    });
  }



  // Validamos la fecha

  function isValidDate(input) {
    
    const dateValue = input.value;
    
    const [month, year] = dateValue.split('/');

    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    if (monthNumber < 1 || monthNumber > 12) {
      return false;
    }

    const currentYear = new Date().getFullYear() % 100;
    console.log (currentYear);
    
    const currentMonth = new Date().getMonth() + 1; 
    console.log (currentMonth);

    // Valida el año (debe ser mayor o igual al año y mes actual)
    if (yearNumber > currentYear || (yearNumber == currentYear && monthNumber >= currentMonth)) {
      return true;
    }

    return false;
  }



  const expirationDateInput = document.getElementById('expirationDate');

  expirationDateInput.addEventListener('blur', function() {
    if (!isValidDate(this)) {

      alert('Fecha de vencimiento no válida. Por favor ingrese una fecha válida.');
      this.value = '';
      
    }
  });




  // LLamamos a la función anterior con cada campo del form

  for (const element of creditCardFields) {
    validateNumberInput(element);
  }

  for (const element of bankTransferFields) {
    validateNumberInput(element);
  }



  // Funciones que activa los campos de una opcion y desactiva los de la otra, según cual este seleccionada.

  function enableFields(fields){
    for (const field of fields){
      field.disabled = false;
      field.required = true;
    }
  }

  function disableFields(fields){
    for (const field of fields){
      field.disabled = true;
      field.required = false;
    }
  }




  // Agregamos un addEventListener a cada radio button, ejecutandose cuando es seleccionado, y haciendo que sus campos se habiliten (y deshabilitando los del otro radio button)

  creditCard.addEventListener('change', function () {
    if (creditCard.checked) {
      enableFields(creditCardFields);
      disableFields(bankTransferFields);
    }
  });

  bankTransfer.addEventListener('change', function () {
    if (bankTransfer.checked) {
      enableFields(bankTransferFields);
      disableFields(creditCardFields);
    }
  });



  // Agrega un evento al botón de confirmación de compra

  const purchaseButton = document.getElementById('confirmPurchase');

  const form = document.querySelector("#form");

  purchaseButton.addEventListener("click", event => {



    // Si no se cumple que un elemento del form no es valido, finaliza la propagación del código y no ejecuta el caso por defecto
    
    if (!form.checkValidity()){
      event.preventDefault();
      event.stopPropagation();
    }



    // Agregamos una clase al form que permite ver que campos son correctos y cuales no

    form.classList.add("was-validated");



    // Agregamos un addEventListener al radio buton de tarjeta de credito, que hace que cuando cambie (de chequeado a no chequeado y viceversa)
    // permite mostrar los mensajes de error de los inputs relacionados con el mismo (en caso de que sean incorrectos)

    const selectionTextMessage = document.getElementById('selectionText-error');
    const cardNumberMessage = document.getElementById('cardNumber-error');
    const cvvMessage = document.getElementById('cvv-error');
    const expirationDateMessage = document.getElementById('expirationDate-error');
    const accountNumberMessage = document.getElementById('accountNumber-error');

    creditCard.addEventListener('change', function(){

      if (creditCard.checked) {

        selectionTextMessage.hidden = true;

        accountNumberMessage.hidden = true;

        for (const element of creditCardFields) {

          if (!element.checkValidity()){

            if (element.id == "creditCardNumber"){
              
              cardNumberMessage.hidden = false;
            } else if (element.id == "cvv"){
              cvvMessage.hidden = false;
            } else {
              expirationDateMessage.hidden = false;

            }
          }
        }
      }

    });



    // Aquí agregamos otro addEventListener, pero al radio button de transferencia bancaria, el cual realiza lo mismo que la funcion anterior
    // pero para los inputs relacionados con este

    bankTransfer.addEventListener('change', function(){

      if (bankTransfer.checked) {

        selectionTextMessage.hidden = true;

        cardNumberMessage.hidden = true;
        cvvMessage.hidden = true;
        expirationDateMessage.hidden = true;

        for (const element of bankTransferFields) {

          if (!element.checkValidity()){

            accountNumberMessage.hidden = false;

          }
        }
      }
    });


    /*
    Agregamos un addEventListener a cada uno de los campos habilitados (en forma de pago), los cuales ejecutan una función al modificar su contenido
    que muestra un mensaje de error en caso de no ser válidos
    */
    


    function checkCreditCardNumber(element){

      element.addEventListener("input", function(){

        if (element.value.length < 16){
          element.setCustomValidity("Número de tarjeta incompleto");
          cardNumberMessage.hidden = false;
        } else {
          element.setCustomValidity("");
          cardNumberMessage.hidden = true;
        }

      });

    }


    function checkCVV(element){

      element.addEventListener("input", function(){

        if (element.value.length < 3){
          element.setCustomValidity("Código de seguridad incompleto");
          cvvMessage.hidden = false;
        } else {
          element.setCustomValidity("");
          cvvMessage.hidden = true;
        }

      });

    }


    function checkExpirationDate(element){

      element.addEventListener("input", function(){

        if (element.value.length < 4){
          element.setCustomValidity("Fecha de vencimiento incompleta");
          expirationDateMessage.hidden = false;
        } else {
          element.setCustomValidity("");
          expirationDateMessage.hidden = true;
        }

      });

    }


    function checkCreditCardFields(){

      for (const element of creditCardFields) {

        if (element.id == "creditCardNumber"){
          checkCreditCardNumber(element);
        }

        if (element.id == "cvv"){
          checkCVV(element);
        }

        if (element.id == "expirationDate"){
          checkExpirationDate(element);
        }
  
      }
    }

    checkCreditCardFields();



    function checkAccountNumber(element){

      element.addEventListener("input", function(){
        if (!element.checkValidity()){
          accountNumberMessage.hidden = false;
        } else {
          accountNumberMessage.hidden = true;
        }
      });

    }

    function checkBankTransferFields(){

      for (const element of bankTransferFields) {
        
        checkAccountNumber(element);
  
      }
    }

    checkBankTransferFields();


    // Si la compra es valida (gracias a una funcion que revisa cada campo del form), se muestra un mensaje de realizacion de la misma, ademas de
    // realizarse un submit del form

    if (validatePurchase()){

    // Simula una compra exitosa

      const successBanner = document.getElementById('successBanner');
      successBanner.classList.remove("d-none");
      successBanner.classList.add("d-block");

      setTimeout(function () {

        successBanner.classList.remove("d-block");
        successBanner.classList.add("d-none");
        form.submit();
      
      }, 4000);

    }

  });

  // Función que realiza las validaciones del método de pago, devolviendo true en caso de que no haya errores

  function validatePurchase() {

    const street = document.querySelector("#street");
    const number = document.querySelector("#number");
    const corner = document.querySelector("#corner");

    const selectionText = document.getElementById('selectionText');
    const cartItems = document.querySelectorAll('.list-group-item');

    // Agregamos los mensajes de error a JS

    const selectionTextMessage = document.getElementById('selectionText-error');
    const cardNumberMessage = document.getElementById('cardNumber-error');
    const cvvMessage = document.getElementById('cvv-error');
    const expirationDateMessage = document.getElementById('expirationDate-error');
    const accountNumberMessage = document.getElementById('accountNumber-error');

    // Verifica todas las validaciones aquí

    let isValid = true;

    // Observamos el contenido de cada uno de los inputs de calle, número, esquina, junto con forma de pago para asegurarnos de que ninguno este vacío
    // En caso de que alguno este vacío, mostramos un mensaje de error, y lo borramos en caso de que no lo este.

    if (!street.checkValidity() || !number.checkValidity() || !corner.checkValidity()){
      isValid = false;
    }

    if (selectionText.textContent == 'No ha seleccionado') {
      selectionTextMessage.hidden = false;
      isValid = false;
    } else {

      // También observamos cada uno de los campos de la forma de pago en caso de que se haya seleccionado alguna.

      // Observamos los campos del radio button "tarjeta de crédito"

      selectionTextMessage.hidden = true;
      if (selectionText.textContent == 'Tarjeta de crédito') {
        let cont = 0;
        for (const element of creditCardFields) {
          if (!element.checkValidity()){

            if (element.id == "creditCardNumber"){
              cardNumberMessage.hidden = false;
            } else if (element.id == "cvv"){
              cvvMessage.hidden = false;
            } else {
              expirationDateMessage.hidden = false;
            }

            isValid = false;

          } else {

            cont++;
            if (cont == creditCardFields.length){
              selectionTextMessage.hidden = true;
            }

          }
        }
      }
      

      // Observamos los campos del radio button "transferencia bancaria"

      else {

        let cont = 0;
        for (const element of bankTransferFields){

          if (!element.checkValidity()){
            accountNumberMessage.hidden = false;
            isValid = false;
          } else {
            cont++;
            if (cont == bankTransferFields.length){
              accountNumberMessage.hidden = true;
            }
          }

        }

      }
    }
    
      // Validamos las cantidades de cada producto en el carrito

    for (const cartItem of cartItems) {

      const quantityInput = cartItem.querySelector('input');
      const quantity = parseInt(quantityInput.value);

      const errorDiv = cartItem.querySelector('.invalid-feedback');

      if (quantity <= 0) {

        // Si la cantidad es menor o igual a cero, muestra un mensaje de error

        errorDiv.textContent = 'La cantidad debe ser mayor que 0';
        quantityInput.classList.add('is-invalid');
        isValid = false;

      } else {

        // Si la cantidad es mayor a 0, limpia el mensaje de error

        errorDiv.textContent = '';
        quantityInput.classList.remove('is-invalid');

      }

    }

    if (localStorage.getItem("cartItems") == "[]" || localStorage.getItem("cartItems") == undefined){

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
      Para poder realizar la compra, debes tener al menos un producto en el carrito.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      document.body.appendChild(message);

      isValid = false;

    }

    return isValid;

  }
  
});