<template>
  <div class="recuperacion-page">
    <header class="top-nav">
      <div class="logo-container">
        <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" style="height: 32px;"/>
      </div>
      <nav>
        <router-link to="/login">Iniciar sesión</router-link>
        <router-link to="/registro">Registrarse</router-link>
      </nav>
    </header>

    <div class="container container-main">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card recuperacion-card">
            <div class="icon-container">
              <div class="recovery-icon"><i class="pi pi-lock" style="color: #1a6dff; font-size: larger;"></i></div>
            </div>
            
            <h2 class="text-center">Recuperar contraseña</h2>
            <p class="subtitle text-center">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </p>
            
            <form @submit.prevent="handleRecuperacion" v-if="!emailEnviado">
              <div class="mb-4">
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

              <div v-if="showError" class="error-message mb-3">
                {{ errorMessage }}
              </div>
              
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
                </button>
              </div>
            </form>

            <!-- Estado después de enviar el email -->
            <div v-if="emailEnviado" class="email-sent-state">
              <div class="success-icon">✅</div>
              <h3>¡Correo enviado!</h3>
              <p>
                Hemos enviado un enlace de recuperación a <strong>{{ email }}</strong>
              </p>
              <p class="small-text">
                Revisa tu bandeja de entrada y sigue las instrucciones del correo.
                Si no lo encuentras, revisa tu carpeta de spam.
              </p>
              <button @click="resetForm" class="btn btn-outline-primary">
                Enviar a otro correo
              </button>
            </div>
            
            <div class="back-to-login">
              <router-link to="/" class="back-link">
                ← Volver al inicio de sesión
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const emailEnviado = ref(false)

function handleRecuperacion() {
  showError.value = false

  if (!email.value) {
    showError.value = true
    errorMessage.value = 'Por favor, ingrese su correo electrónico.'
    return
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    showError.value = true
    errorMessage.value = 'Por favor, ingrese un correo electrónico válido.'
    return
  }

  loading.value = true

  // Simulación de envío de email
  setTimeout(() => {
    loading.value = false
    emailEnviado.value = true
  }, 2000)
}

function resetForm() {
  emailEnviado.value = false
  email.value = ''
  showError.value = false
  errorMessage.value = ''
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

.recuperacion-page {
  background-color: #f8f9fa;
  min-height: 100vh;
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
  margin-top: 4rem;
  margin-bottom: 3rem;
}

.recuperacion-card {
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  border: none;
  padding: 3rem;
  background: white;
  text-align: center;
}

.icon-container {
  margin-bottom: 1.5rem;
}

.recovery-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.recuperacion-card h2 {
  color: #2a3547;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 2rem;
}

.subtitle {
  color: #6c757d;
  margin-bottom: 2.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

.form-label {
  font-weight: 600;
  color: #2a3547;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  text-align: left;
  display: block;
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
  text-align: center;
}

.form-control:focus {
  border-color: #0056b3;
  background: transparent;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.5rem;
  text-align: center;
}

.btn-primary {
  background-color: #1a6dff;
  border-color: #1a6dff;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #ccc;
  border-color: #ccc;
  transform: none;
}

.email-sent-state {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.email-sent-state h3 {
  color: #51c638;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.email-sent-state p {
  color: #2a3547;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.small-text {
  font-size: 0.9rem;
  color: #6c757d !important;
  margin-bottom: 2rem !important;
}

.btn-outline-primary {
  color: #1a6dff;
  border-color: #1a6dff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: #1a6dff;
  border-color: #1a6dff;
  color: white;
  transform: translateY(-1px);
}

.back-to-login {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.back-link {
  color: #6c757d;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: #1a6dff;
  text-decoration: none;
}
</style>
