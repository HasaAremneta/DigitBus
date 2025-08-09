<template>
  <div class="inicio-sesion-page">
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
        <router-link to="/conocenos">Conócenos</router-link>
      </nav>
    </header>

  <!-- Main Content -->
  <div class="container container-main">
    <div class="row justify-content-center">
      <!-- Login Card -->
      <div class="col-lg-5 col-md-6 mb-4">
        <div class="card login-card">
          <h2 class="text-center">Iniciar sesión</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="username" class="form-label">Nombre de usuario:</label>
              <input type="text" class="form-control" id="username" v-model="username" placeholder="Ingrese su usuario...">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña:</label>
                <input type="password" class="form-control" id="password" v-model="password" placeholder="Contraseña...">
              <div v-if="showPasswordError" class="error-message mt-2">
                Usuario o contraseña incorrectos, vuelva a intentar.
              </div>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">Entrar <i class="pi pi-unlock" style="font-size: 1rem;"></i></button>
            </div>
            <router-link to="/recuperacion" class="forgot-password-link text-center">¿Olvidaste tu contraseña?</router-link>
            <p class="privacy-notice text-center">Aviso de privacidad</p>
          </form>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="col-lg-5 col-md-6">
        <div class="card info-card-dark mb-4">
          <h3>¿No tienes una cuenta?</h3>
          <router-link to="/registro" class="btn btn-secondary">Crear cuenta <i class="pi pi-user-plus"></i></router-link>
        </div>
        <div class="card info-card-blue">
          <h2>¿Ya conoces los</h2>
          <div class="digitbeneficios-text">DigitBeneficios?</div>
          <button class="btn btn-info">¡Quiero conocerlos!</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Custom Modal -->
    <!-- Custom Modal -->
    <div v-if="showModal" class="custom-modal-overlay">
      <div class="custom-modal-content">
        <h4>{{ modalTitle }}</h4>
        <p>{{ modalMessage }}</p>
        <button @click="closeCustomModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '../Services/auth.js' // Asegúrate de que la ruta sea correcta
import { useRouter } from 'vue-router'
import 'primeicons/primeicons.css'

const username = ref('')
const password = ref('')
const showPasswordError = ref(false)
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const router = useRouter()

async function handleLogin(){
  try{
    const response = await login(username.value, password.value);
    

    const token = response.data.token;

    // Guardar el token en el almacenamiento local
    localStorage.setItem('token', token);

    showPasswordError.value = false;
    showCustomModal('Inicio de Sesión Exitoso', '¡Bienvenido de nuevo!');

    //Esperar un momento antes de redirigir a home
    setTimeout(() => {
      router.push('/home');
    }, 1500); // 1.5 segundos
  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    showPasswordError.value = true;
    showCustomModal('Error de Inicio de Sesión', 'Usuario o contraseña incorrectos, vuelva a intentar.');
  }
}
// function handleLogin() {
//   if (username.value === 'José Carlos Camarena Hernández' && password.value === 'xxxxxxxxx') {
//     showPasswordError.value = false
//     showCustomModal('Inicio de Sesión Exitoso', '¡Bienvenido de nuevo!')
//   } else {
//     showPasswordError.value = true
//     showCustomModal('Error de Inicio de Sesión', 'Usuario o contraseña incorrectos, vuelva a intentar.')
//   }
// }
function showCustomModal(title, message) {
  modalTitle.value = title
  modalMessage.value = message
  showModal.value = true
}

function closeCustomModal() {
  showModal.value = false
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
body{
  
}
.inicio-sesion-page {
  /* background-color: #2773c0; */
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background-image: url('../src/img/fondoLogin.png');
  background-repeat: no-repeat;
  background-size: 100%;
  position: relative;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.logo {
  height: 32px;
}
.top-nav nav a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: #2a3547;
  font-weight: 500;
}
.top-nav nav a.router-link-exact-active {
  color: #1a6dff;
  text-decoration: underline;
}

.container-main {
  margin-top: 3rem;
}
.card {
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}
.login-card {
  border: 1px solid #e0e0e0;
  padding: 2rem;
}
.login-card h2 {
  color: #343a40;
  margin-bottom: 2rem;
  font-weight: 600;
}
.form-label {
  font-weight: bold;
  color: #343a40;
  margin-bottom: 0.5rem;
}
.form-control {
  border: none;
  border-bottom: 2px solid #007bff;
  border-radius: 0;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  box-shadow: none !important;
}
.form-control:focus {
  border-color: #0056b3;
}
.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: -1rem;
  margin-bottom: 1rem;
}
.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: bold;
  transition:  0.3s ease;
}
.btn-primary:hover {
  background-color: #218838;
  border-color: #1e7e34;
  transform: scale(1.06);
  transition: 0.4s;
}

.btn-primary:hover i {
  transform: rotate(15deg);
}

@keyframes shake {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
}

.btn-primary:hover i {
  animation: shake 0.6s ease;
}
.forgot-password-link {
  display: block;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
}
.forgot-password-link:hover {
  text-decoration: underline;
}
.privacy-notice {
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #6c757d;
}
.info-card-dark {
  background-color: #343a40;
  color: #ffffff;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
}
.info-card-dark h3 {
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.info-card-dark .btn-secondary {
  background-color: #28a745;
  border-color: #28a745;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: bold;
  color: #ffffff;
  transition: 0.3s ease;
}
.info-card-dark .btn-secondary:hover {
  background-color: #218838;
  border-color: #1e7e34;
  transform: scale(1.06);
  transition: 0.4s;
}

.info-card-dark .btn-secondary:hover i {
  transform: scale(1.2);
}

.info-card-blue {
  background-color: #007bff;
  color: #ffffff;
  padding: 2rem;
  text-align: center;
}
.info-card-blue h3 {
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.info-card-blue .btn-info {
  background-color: #0056b3;
  border-color: #0056b3;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: bold;
  color: #ffffff;
  transition: 0.3s ease;
}
.info-card-blue .btn-info:hover {
  background-color: #004085;
  border-color: #00306c;
  transform: scale(1.06);
  transition: 0.4s;
}
.digitbeneficios-text {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
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
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
}
.custom-modal-content h4 {
  margin-bottom: 1rem;
  color: #343a40;
}
.custom-modal-content p {
  margin-bottom: 1.5rem;
  color: #6c757d;
}
.custom-modal-content button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.custom-modal-content button:hover {
  background-color: #0056b3;
}
</style>