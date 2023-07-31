var contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var message = document.getElementById('message').value;
  
  if (!isAlphanumeric(name)) {
    alert('Por favor, ingresa un nombre alfanumérico.');
    return;
  }

  if (!isValidEmail(email)) {
    alert('Por favor, ingresa un correo electrónico válido.');
    return;
  }

  if (message.length < 5) {
    alert('Por favor, ingresa un mensaje con al menos 5 caracteres.');
    return;
  }

  var mailtoLink = 'mailto:' + email + '?subject=Contacto desde el formulario&body=' + encodeURIComponent('Nombre: ' + name + '\n\n' + 'Mensaje: ' + message);
  
  window.location.href = mailtoLink;
});

function isAlphanumeric(input) {
  var alphanumericExp = /^[0-9a-zA-Z]+$/;
  return alphanumericExp.test(input);
}

function isValidEmail(input) {
  var emailExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailExp.test(input);
}
