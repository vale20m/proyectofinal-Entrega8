document.addEventListener("DOMContentLoaded", function () {
    
  // Obtenemos el correo electrónico del `localStorage`

  const emailTemp = localStorage.getItem("email");

  // Guardamos en constantes los elementos del HTML

  const emailInput = document.getElementById("email");
  const nameInput = document.getElementById("name");
  const secondNameInput = document.getElementById("secondName");
  const lastNameInput = document.getElementById("lastName");
  const secondLastNameInput = document.getElementById("secondLastName");
  const phoneInput = document.getElementById("phone");


  // Rellena automáticamente el campo de correo con el valor del `localStorage` (el correo actual)

  emailInput.value = emailTemp;

  // En caso de que el usuario ya los haya llenado e ingrese nuevamente, se cargan los datos anteriores

  function loadInfo(){

    const userProfile = JSON.parse(localStorage.getItem(emailTemp));

    if (userProfile) {

      // Se rellenan los campos

      nameInput.value = userProfile.name;
      secondNameInput.value = userProfile.secondName;
      lastNameInput.value = userProfile.lastName;
      secondLastNameInput.value = userProfile.secondLastName;
      phoneInput.value = userProfile.phone;

      // Cargamos la imagen de perfil si existe.

      if (userProfile.profileImage) {
        const defaultProfileImage = document.getElementById("shownPicture");
        defaultProfileImage.src = userProfile.profileImage;
      }
    }

  }

  loadInfo();
  
  // Obtener el formulario del perfil

  const profileForm = document.getElementById("profile-form");
  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", event => {
    
    if (!profileForm.checkValidity()){
      event.preventDefault();
      event.stopPropagation();
    }

    profileForm.classList.add("was-validated");

    const userEmail = emailInput.value;

    if (checkFields()){

    // Si el correo de la cuenta actual coincide con el input, guardar los cambios en el `localStorage`

      const userProfile = {
        name: nameInput.value,
        secondName: secondNameInput.value,
        lastName: lastNameInput.value,
        secondLastName: secondLastNameInput.value,
        phone: phoneInput.value,
        
        // Traemos la imagen del HTML y la guardamos

        profileImage: document.getElementById("shownPicture").src
      };

      // Guardar los datos del perfil en el `localStorage` utilizando el correo como clave

      localStorage.setItem(userEmail, JSON.stringify(userProfile));

      // Mostramos una alerta de que el perfil ha sido actualizado

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
        Datos del perfil actualizados exitosamente.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
      
      document.body.appendChild(message);

      setTimeout( () => {
        profileForm.submit();
      }, 3000);

    }
    
  });

  // Obtenemos el campo de selección de imagen

  const profileImageInput = document.getElementById("profileImage");

  profileImageInput.addEventListener("change", function (e) {
    
    const selectedImage = e.target.files[0];

    if (selectedImage) {

      // La pagina interpreta la imagen seleccionada por el usuario y la coloca como foto de perfil (la guarda en el localStorage)

      const reader = new FileReader();
      reader.onload = function (event) {
        const defaultProfileImage = document.getElementById("shownPicture");
        defaultProfileImage.src = event.target.result;
      };
      reader.readAsDataURL(selectedImage);

    }

  });

  function checkFields(){

    let emptyFields = false;
    let emptyEmail = false;
    let invalidEmail = false;
    let invalidFields = false;

    if (nameInput.value == ""){
      emptyFields = true;
    }

    if (lastNameInput.value == ""){
      emptyFields = true;
    }

    if (emailInput.value == ""){
      emptyEmail = true;
    }

    if (emailInput.value != emailTemp){
      invalidEmail = true;
    }

    if (!nameInput.checkValidity() || !lastNameInput.checkValidity() || !emailInput.checkValidity() || !phoneInput.checkValidity() || !secondNameInput.checkValidity() || !secondLastNameInput.checkValidity()){
      invalidFields = true;
    }

    // Le damos un feedback al usuario sobre la situación

    if (emptyFields){

      // Mostramos una alerta en caso de que algun campo obligatorio * este vacío

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
      Por favor, complete los campos obligatorios.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      document.body.appendChild(message);

      return false;

    }
    
    if (emptyEmail){

      // Mostramos una alerta en caso de que el campo de email este vacío

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
      Por favor, complete el campo de correo.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      document.body.appendChild(message);

      return false;

    }
    
    if (invalidEmail){

      // Mostramos una alerta en caso de que el email ingresado en su respectivo campo no coincida con el del usuario actual

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
      El correo ingresado no coincide con el correo almacenado. Debe registrarse nuevamente.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      document.body.appendChild(message);

      return false;

    }

    if (invalidFields){

      // Mostramos una alerta en caso de que algun campo tenga caracteres inválidos

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
      Algunos campos son inválidos o están incompletos.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      document.body.appendChild(message);

      return false;

    }

    return true;

  }

});