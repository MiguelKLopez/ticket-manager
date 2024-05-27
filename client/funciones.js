// Función login
async function login() {
  const usuario = document.getElementById('usuario').value;
  const contraseña = document.getElementById('contraseña').value;
  const errorMessage = document.getElementById('error-message');

  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, contraseña }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data.error) {
      errorMessage.textContent = data.error;
    } else {
      errorMessage.textContent = 'Login correcto';
      window.location.href = 'home.html';  
    }
  } catch (error) {
    errorMessage.textContent = 'Error en la solicitud: ' + error.message;
  }
}
