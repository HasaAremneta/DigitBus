<template>
  <div>
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
        <router-link to="/home">Inicio</router-link>
        <router-link to="/conocenos">Conócenos</router-link>
      </nav>
    </header>

    <div class="container container-main">
      <div class="profile-settings-card">
        <h2>Ajustes del perfil</h2>
        <form @submit.prevent="saveChanges">
          <div class="mb-3">
            <label for="username" class="form-label">Nombre de usuario:</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="username"
              placeholder="Nombre de usuario"
            >
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico:</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              placeholder="Correo electrónico"
            >
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Nueva contraseña:</label>
            <input
              type="password"
              class="form-control"
              id="newPassword"
              v-model="newPassword"
              placeholder="Nueva contraseña"
            >
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-save-changes">Guardar cambios</button>
          </div>
          <router-link to="/ajustes" class="btn-back">Volver</router-link>
        </form>
      </div>
    </div>

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

const username = ref('')
const email = ref('')
const newPassword = ref('')
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

function saveChanges() {
  if (username.value === '' || email.value === '' || newPassword.value === '') {
    showCustomModal('Error al Guardar', 'Por favor, complete todos los campos.')
  } else if (!isValidEmail(email.value)) {
    showCustomModal('Error de Validación', 'Por favor, ingrese un correo electrónico válido.')
  } else {
    // Aquí podrías enviar los datos a un backend si lo necesitas
    showCustomModal('Cambios Guardados', '¡Los cambios de perfil han sido guardados exitosamente!')
    newPassword.value = ''
  }
}

function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function goBack() {
  showCustomModal('Volver', 'Simulando volver a la página anterior.')
}

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
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
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
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 120px);
}
.profile-settings-card {
  background-color: #ffffff;
  padding: 3rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 100%;
  max-width: 500px;
}
.profile-settings-card h2 {
  color: #343a40;
  margin-bottom: 3rem;
  font-weight: 600;
  font-size: 2.2rem;
  text-align: center;
}
.form-label {
  font-weight: bold;
  color: #343a40;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 1.1rem;
}
.form-control {
  border: none;
  border-bottom: 2px solid #007bff;
  border-radius: 0;
  padding: 0.75rem 0.5rem;
  margin-bottom: 2.5rem;
  box-shadow: none !important;
  font-size: 1.1rem;
  color: #343a40;
}
.form-control:focus {
  border-color: #0056b3;
}
.btn-save-changes {
  background-color: #28a745;
  border-color: #28a745;
  padding: 1rem 3rem;
  border-radius: 0.5rem;
  font-weight: bold;
  color: #ffffff;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1.5rem;
}
.btn-save-changes:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
.btn-back {
  display: block;
  margin-top: 1.5rem;
  color: #007bff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}
.btn-back:hover {
  text-decoration: underline;
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