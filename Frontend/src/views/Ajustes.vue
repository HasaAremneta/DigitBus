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
      <div class="settings-card">
        <h2>Ventana de ajustes</h2>
        <div class="d-grid gap-3">
          <button @click="goToAccountSettings" class="btn btn-setting">Ajustes de la cuenta</button>
          <button @click="goToAddCard" class="btn btn-setting">Agregar tarjeta</button>
        </div>
        <a href="#" @click.prevent="goBack" class="btn-back">Volver</a>
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
import { useRouter } from 'vue-router'

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const router = useRouter()

function goToAccountSettings() {
  // Navega a la ruta de ajustes de perfil
  router.push('/ajustes-perfil')
}

function goToAddCard() {
  // Navega a la ruta de agregar tarjeta
  router.push('/agregar-tarjeta')
}

function goBack() {
  window.history.back();
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
}
.settings-card {
  background-color: #ffffff;
  padding: 3rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 500px;
}
.settings-card h2 {
  color: #343a40;
  margin-bottom: 3rem;
  font-weight: 600;
  font-size: 2.2rem;
}
.btn-setting {
  background-color: #343a40;
  border-color: #343a40;
  padding: 1rem 3rem;
  border-radius: 0.5rem;
  font-weight: bold;
  color: #ffffff;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-bottom: 1.5rem;
}
.btn-setting:hover {
  background-color: #212529;
  border-color: #1a1d20;
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