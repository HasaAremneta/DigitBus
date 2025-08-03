<template>
  <div>
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
        <router-link to="/">Inicio</router-link>
        <router-link to="/conocenos">Conócenos</router-link>
      </nav>
    </header>

    <div class="container container-main">
      <div class="card-form">
        <h2>Agregar tarjeta</h2>
        <form @submit.prevent="saveCard">
          <div class="mb-3">
            <label for="cardNumber" class="form-label">Número de tarjeta:</label>
            <input
              type="text"
              class="form-control"
              id="cardNumber"
              v-model="cardNumber"
              @input="formatCardNumber"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              maxlength="19"
            >
          </div>
          <div class="mb-3">
            <label for="cardType" class="form-label">Selecciona el tipo de tarjeta:</label>
            <select class="form-select" id="cardType" v-model="cardType">
              <option value="" disabled>Tipo de tarjeta</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Adulto Mayor">Adulto Mayor</option>
              <option value="Discapacitado">Discapacitado</option>
            </select>
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-save-card">Guardar tarjeta</button>
          </div>
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

const cardNumber = ref('')
const cardType = ref('')
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

function saveCard() {
  if (cardNumber.value.length === 19 && cardType.value !== '') {
    showCustomModal('Tarjeta Guardada', 'La tarjeta ha sido guardada exitosamente.')
    // Aquí podrías enviar los datos a un backend si lo necesitas
    cardNumber.value = ''
    cardType.value = ''
  } else {
    showCustomModal('Error al Guardar', 'Por favor, ingrese un número de tarjeta válido (XXXX-XXXX-XXXX-XXXX) y seleccione un tipo de tarjeta.')
  }
}

function formatCardNumber() {
  let digitsOnly = cardNumber.value.replace(/\D/g, '')
  cardNumber.value = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1-')
  if (cardNumber.value.length > 19) {
    cardNumber.value = cardNumber.value.substring(0, 19)
  }
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
.card-form {
  background-color: #ffffff;
  padding: 3rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 500px;
}
.card-form h2 {
  color: #343a40;
  margin-bottom: 3rem;
  font-weight: 600;
  font-size: 2.2rem;
}
.form-label {
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
  display: block;
  text-align: left;
  font-size: 1.1rem;
}
.form-control, .form-select {
  border: none;
  border-bottom: 2px solid #007bff;
  border-radius: 0;
  padding: 0.75rem 0.5rem;
  margin-bottom: 2.5rem;
  box-shadow: none !important;
  font-size: 1.1rem;
  color: #343a40;
}
.form-control:focus, .form-select:focus {
  border-color: #0056b3;
}
.form-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}
.btn-save-card {
  background-color: #343a40;
  border-color: #343a40;
  padding: 1rem 3rem;
  border-radius: 0.5rem;
  font-weight: bold;
  color: #ffffff;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1.5rem;
}
.btn-save-card:hover {
  background-color: #212529;
  border-color: #1a1d20;
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