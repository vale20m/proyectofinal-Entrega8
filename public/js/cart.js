// Constantes para el funcionamiento de todo el codigo (url y contenedores de html)

// API que tiene el valor de las divisas actualizado

const URL_CURRENCIES = "https://v6.exchangerate-api.com/v6/c94b63afd58937412a283930/latest/USD";

const cartItems = document.querySelector("#cartItems");

const cartControls = document.querySelector("#cartControls");

/*
Función que calcula el subtotal del producto en el carrito, multiplicando su
precio por lacantidad, y agregando la moneda al comienzo (devolviendo un sitring)
*/

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

  if (array[0].message != undefined){
    return cartSubtotal;
  }

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


function showCartItems(array){

  // Agregamos un if para que las opciones de compra no se muestren si no hay items en el carrito
  
  if (array.length < 1){
    cartControls.classList.add("d-none");
  }

  // Sección que funciona como "título" de la tabla del carrito
  
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
            <input type="number" class="form-control w-75 ${item.count <= 0 ? 'is-invalid' : ''}" id="${quantityInputId}" value="${item.count}" min="0">
            <div class="invalid-feedback">La cantidad debe ser mayor que 0</div> <!-- Mensaje de error --></div>
          <h4 class="d-md-none col-sm-3 offset-sm-0 col-5 offset-1 my-md-auto mt-sm-3 mt-2">Subtotal: </h4>
          <h4 id="subtotal" class="col-md-2 col-sm-3 col-6 my-md-auto mt-2">${calculateSubtotal(item.currency, item.unitCost, item.count)}</h4></div>
        <button type="button" id="closeButton" class="close btn position-absolute top-0 end-0" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
      </div>`;


    /*
    Agregamos un add event listener que se activa cuanto se hace click en el boton 
    "cerrar" de un item del carrito, eliminandolo del local storage
    */

    const closeButton = div.querySelector("#closeButton");

    closeButton.addEventListener("click", async function(){
      
      div.innerHTML = "";

      await deleteCartProducts(CART_URL + item.user + "/" + item.id);

      array = await getCart(CART_URL + item.user);

      updateQuantities(array);
        
    });

    /*
    Anidamos un addEventListener al elemento "input", el cual ejecuta una funcion
    que modifica el subtotal del producto cada vez que se modifica el valor de dicho input.
    */

    const inputCount = div.querySelector("input");

    inputCount.addEventListener("input", async function(){

      const newCount = inputCount.value;
      if (newCount < 0){
        inputCount.value = 0;
        return;
      }

      const subtotalContainer = div.querySelector("#subtotal");
      subtotalContainer.textContent = calculateSubtotal(item.currency, item.unitCost, newCount);
      
      // Modificamos la cantidad y actualizamos la base de datos
      
      await modifyCount(CART_URL + item.user + "/" + item.id, {count: newCount});

      array = await getCart(CART_URL + item.user);

      // Modificamos el valor del subtotal, el costo de envío y el total del carrito
    
      updateQuantities(array);

    });

    // Agregamos el div a HTML

    cartItems.appendChild(div);
  }

  updateQuantities(array);

}

// Variable para manejar los items del carrito

let cartArray;

// Variable que contendra los distintos cambios de varias monedas a peso uruguayo

let currencyValues;

// Función que muestra los elementos del carrito

async function showCart() {

  cartArray = await getCart(CART_URL + localStorage.getItem("email"));
  currencyValues = await getCurrencies(URL_CURRENCIES);

  if (cartArray[0].message == undefined){
    showCartItems(cartArray);
  } else {
    cartItems.innerHTML = `<h1 class="mt-5">Actualmente no hay productos en el carrito</h1>`
    cartControls.classList.add("d-none");
  }

}

// Función que devuelve el mensaje de "compra existosa" del JSON

async function buyMessage(url){

  try {
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      }
    });

    const responseContents = await response.json();

    return responseContents.msg;

  } catch (error) {
    console.log(error.message);
  }

}

// Función que retorna todos los elementos del carrito (que pertenecen a un usuario)

async function getCart(url){

  try {

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      }
    });
    const responseContents = await response.json();

    return responseContents;

  } catch (error) {
    console.log(error.message);
  }

}

// Función que toma el cambio entre el dolar y el peso uruguayo

async function getCurrencies(url){

  try {
  
    const responseCurrencies = await fetch(url);
    const responseContentsCurrencies = await responseCurrencies.json();

    return responseContentsCurrencies.conversion_rates.UYU;
  
  } catch (error) {
    console.log(error.message);
  }

}

// Función que elimina uno o todos los items del carrito de un usuario

async function deleteCartProducts(url){

  try {
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      }
    });

    const responseContents = await response.json();

    return responseContents;

  } catch (error) {
    console.log(error.message);
  }

}

// Función que permite modificar la cantidad de un producto del carrito (en la base de datos)

async function modifyCount(url, count){

  try {

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(count)
    });

    const responseContents = await response.json();

    return responseContents;
    
  } catch (error) {
    console.log(error.message);
  }

}

//Función que establece el atributo "bought" de todos los items del carrito de un usuario de 0 a 1 (comprado)

async function putItemsBought(url){

  try {

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });

    const responseContents = await response.json();

    return responseContents;
    
  } catch (error) {
    console.log(error.message);
  }

}

// Función para enviar los datos de la tabla "cart" a la tabla de "purchases" (permite realizar la compra)

async function postPurchase(url, item){

  try {
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(item)
    });

    const responseContents = await response.json();

    return responseContents;

  } catch (error) {
    console.log(error.message);
  }

}

// Agregamos un addEventListener al metodo de envío, el cual actualiza los valores del total e impuestos

shipType.addEventListener("change", async function(){

  cartArray = await getCart(CART_URL + localStorage.getItem("email"));
  updateQuantities(cartArray);

});


// Entrega 6 - Funcionamiento del form

document.addEventListener('DOMContentLoaded', function () {

  showCart();

  // Guardamos en constantes los elementos de HTML que necesitamos para el funcionamiento del form

  const street = document.querySelector("#street");
  const number = document.querySelector("#number");
  const corner = document.querySelector("#corner");

  const creditCard = document.getElementById('creditCard');
  const bankTransfer = document.getElementById('bankTransfer');
  const creditCardFields = document.getElementById("creditCardFields").getElementsByTagName("input");
  const bankTransferFields = document.getElementById("bankTransferFields").getElementsByTagName("input");


  // Función que permite realizar la compra (según el método de pago elegido), enviando datos a la tabla "purchases"


  async function makePurchase(url, item){

    let totalValue = cartTotal.innerHTML;
    totalValue = totalValue.slice(4);
    totalValue = parseInt(totalValue);

    if (creditCard.checked){
  
      await postPurchase(url, {idPurchase: item.idPurchase, user: item.user, shipType: shipType.value, street: street.value, number: number.value, corner: corner.value,
        creditCardNumber: creditCardFields[0].value, cvv: creditCardFields[1].value, expirationDate: creditCardFields[2].value, accountNumber: null, totalCost: totalValue
      });

    } else {
  
      await postPurchase(url, {idPurchase: item.idPurchase, user: item.user, shipType: shipType.value, street: street.value, number: number.value,
        corner: corner.value, creditCardNumber: null, cvv: null, expirationDate: null, accountNumber: bankTransferFields[0].value, totalCost: totalValue
      });
  
    }
  
  }



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



  // Validamos la fecha ingresada por el usuario

  function isValidDate(input) {
    
    const dateValue = input.value;
    
    const [month, year] = dateValue.split('/');

    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    if (monthNumber < 1 || monthNumber > 12) {
      return false;
    }

    const currentYear = new Date().getFullYear() % 100;
    
    const currentMonth = new Date().getMonth() + 1; 

    // Valida el año (debe ser mayor o igual al año y mes actual)
    if (yearNumber > currentYear || (yearNumber == currentYear && monthNumber >= currentMonth)) {
      return true;
    }

    return false;
  }



  const expirationDateInput = document.getElementById('expirationDate');

  expirationDateInput.addEventListener('blur', function() {
    if (!isValidDate(this)) {

      const modal = document.querySelector("#paymentModal");

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-success alert-dismissible fade show" role="alert">
        Fecha de vencimiento inválida. Por favor, ingrese una fecha válida.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      modal.appendChild(message);

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



  // Funciones que activan los campos de una opcion y desactivan los de la otra, según cual este seleccionada.

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

  purchaseButton.addEventListener("click", async function(event) {



    // Si no se cumple que un elemento del form no es valido, finaliza la propagación del código y no ejecuta el caso por defecto
    
    if (!form.checkValidity()){
      event.preventDefault();
      event.stopPropagation();
    }



    // Agregamos una clase al form que permite ver que campos son correctos y cuales no

    form.classList.add("was-validated");


    /*
    Agregamos un addEventListener al radio buton de tarjeta de credito, que hace que cuando cambie (de chequeado a no chequeado y viceversa)
    permite mostrar los mensajes de error de los inputs relacionados con el mismo (en caso de que sean incorrectos)
    */

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


    /*
    Aquí agregamos otro addEventListener, pero al radio button de transferencia bancaria,
    el cual realiza lo mismo que la funcion anterior pero para los inputs relacionados con este
    */

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

    /*
    Si la compra es valida (gracias a una funcion que revisa cada campo del form), se
    muestra un mensaje de realizacion de la misma, ademas de realizarse un submit del form
    */

    if (validatePurchase()){

      // Simula una compra exitosa

      cartArray = await getCart(CART_URL + localStorage.getItem("email"));

      // Enviamos los datos a la tabla "purchases"

      await makePurchase(CART_URL + "purchase", cartArray[0]);

      // Seteamos el valor de compra en 1 para que no se sigan mostrando en el carrito

      await putItemsBought(CART_URL + localStorage.getItem("email"));

      const content = await buyMessage(CART_URL);

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-success alert-dismissible fade show" role="alert">
        ${content}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      document.body.appendChild(message);

      purchaseButton.disabled = true;


      setTimeout(function () {

        // Enviamos el form

        form.submit();
      
      }, 5000);

    }

  });

  // Función que realiza las validaciones del método de pago, devolviendo true en caso de que no haya errores

  function validatePurchase() {

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

    // Chequeamos que hayan elementos en el carrito, y en caso de que no hayan y se intente comprar, se muestra una alerta

    if (cartArray[0].message != undefined){

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