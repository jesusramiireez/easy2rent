document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
  
    // Aquí puedes agregar tu lógica para enviar el formulario por correo electrónico o almacenarlo en una base de datos
  
    // Ejemplo de alerta
    alert('Gracias por tu mensaje, ' + name + '! Nos pondremos en contacto contigo pronto.');
  
    // Limpia el formulario
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
  });