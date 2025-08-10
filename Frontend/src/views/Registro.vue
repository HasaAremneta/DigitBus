<template>
  <div class="registro-page">
    <header class="top-nav">
      <div class="logo-container">
        <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      </div>
      <nav>
        <router-link to="/">Iniciar sesión</router-link>
        <router-link to="/registro">Registrarse</router-link>
      </nav>
    </header>

    <div class="container container-main">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card registro-card">
            <h2 class="text-center">Crear cuenta</h2>
            <p class="subtitle text-center">Únete a DigitBus y comienza tu experiencia</p>
            
            <form @submit.prevent="handleRegistro">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre completo:</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="nombre" 
                  v-model="nombre" 
                  placeholder="Ingrese su nombre completo"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico:</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="email" 
                  placeholder="correo@ejemplo.com"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña:</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="password" 
                  placeholder="Mínimo 8 caracteres"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar contraseña:</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  placeholder="Repita su contraseña"
                  required
                >
              </div>

              <!-- <div v-if="showError" class="error-message mb-3">
                {{ errorMessage }}
              </div> -->

              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="terminos" 
                  v-model="aceptaTerminos"
                  required
                >
                <label class="form-check-label" for="terminos">
                  Acepto los <a href="#" class="link-terminos">términos y condiciones</a>
                </label>
              </div>
              
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }} <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'"></i>

                </button>
              </div>
              
              <p class="login-link text-center">
                ¿Ya tienes una cuenta? 
                <router-link to="/" class="link-login">Inicia sesión</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showModal" class="custom-modal-overlay">
      <div class="custom-modal-content">
        <h4>{{ modalTitle }}</h4>
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { registroUsuario } from '@/Services/registro'
import { useRouter } from 'vue-router'


const router = useRouter()

// Variables del formulario
const nombre = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const aceptaTerminos = ref(false)

// Estados
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// Modal
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

// Funciones modal
function showCustomModal(title, message) {
  modalTitle.value = title
  modalMessage.value = message
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

// Función principal de registro
async function handleRegistro() {
  showError.value = false

  // Validaciones
  if (!nombre.value || !email.value || !password.value || !confirmPassword.value) {
    showError.value = true
    errorMessage.value = 'Por favor, complete todos los campos.'
    return
  }
  if (password.value.length < 8) {
    showError.value = true
    errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  if (password.value !== confirmPassword.value) {
    showError.value = true
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }
  if (!aceptaTerminos.value) {
    showError.value = true
    errorMessage.value = 'Debe aceptar los términos y condiciones.'
    return
  }

  loading.value = true

  try {
    const response = await registroUsuario({
      NombreUsuario: nombre.value,
      Nombre: nombre.value.split(' ')[0],
      ApellidoPaterno: 'ApellidoP', // Cambia si tienes input real
      ApellidoMaterno: 'ApellidoM',
      DiaNacimiento: '01',
      MesNacimiento: '01',
      AnoNacimiento: '2000',
      Correo: email.value,
      password: password.value,
    })

    loading.value = false

    showCustomModal(
      'Cuenta Creada',
      response.data.message || '¡Tu cuenta ha sido creada exitosamente! Ya puedes iniciar sesión.'
    )

    // Limpiar formulario
    nombre.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    aceptaTerminos.value = false

    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    loading.value = false
    showError.value = true
      console.log(error);
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Error al registrar usuario. Intenta de nuevo.'
    }
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

.registro-page {
  background-image: url('../src/img/fondoLogin.png');
  background-size: 100%;
  min-height: 100%;
  font-family: 'Inter', sans-serif;
 
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  color: #1a6dff;
  margin: 0;
}

.top-nav nav a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: #2a3547;
  font-weight: 500;
  transition: color 0.3s;
}

.top-nav nav a:hover,
.top-nav nav a.router-link-exact-active {
  color: #1a6dff;
}

.container-main {
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.logo {
  height: 32px;
}

.registro-card {
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  border: none;
  padding: 3rem;
  background: white;
}

.registro-card h2 {
  color: #2a3547;
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 2.2rem;
}

.subtitle {
  color: #6c757d;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
}

.form-label {
  font-weight: 600;
  color: #2a3547;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.form-control {
  border: none;
  border-bottom: 2px solid #1a6dff;
  border-radius: 0;
  padding: 0.75rem 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: none !important;
  font-size: 1rem;
  background: transparent;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #0056b3;
  background: transparent;
}

.form-check {
  margin-bottom: 2rem;
}

.form-check-input {
  margin-right: 0.5rem;
}

.form-check-label {
  color: #2a3547;
  font-size: 0.95rem;
}

.link-terminos {
  color: #1a6dff;
  text-decoration: none;
  font-weight: 500;
}

.link-terminos:hover {
  text-decoration: underline;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.5rem;
}

.btn-primary {
  background-color: #51c638;
  border-color: #51c638;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #45a832;
  border-color: #45a832;
  transform: scale(1.06);
  transition: 0.4s;
}

.btn-primary:disabled {
  background-color: #ccc;
  border-color: #ccc;
  transform: none;
}

.login-link {
  margin-top: 2rem;
  color: #6c757d;
  font-size: 0.95rem;
}

.link-login {
  color: #1a6dff;
  text-decoration: none;
  font-weight: 500;
}

.link-login:hover {
  text-decoration: underline;
  color: #0056b3;
}

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.custom-modal-content {
  background-color: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.custom-modal-content h4 {
  margin-bottom: 1rem;
  color: #2a3547;
  font-weight: 600;
}

.custom-modal-content p {
  margin-bottom: 1.5rem;
  color: #6c757d;
}

.custom-modal-content button {
  background-color: #1a6dff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.custom-modal-content button:hover {
  background-color: #0056b3;
}
</style>
