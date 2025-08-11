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
        
        <!-- Formulario usuario y correo -->
        <form @submit.prevent="saveUserData">
          <div class="mb-3">
            <label for="username" class="form-label">Nombre de usuario:</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="username"
              :placeholder="username"
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico:</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              :placeholder="email"
            />
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-save-changes">Guardar usuario y correo</button>
          </div>
        </form>

        <hr style="margin: 2rem 0;" />

        <!-- Formulario contraseña -->
        <form @submit.prevent="savePassword">
          <div class="mb-3">
            <label for="curPassword" class="form-label">Contraseña Actual:</label>
            <input
              type="password"
              class="form-control"
              id="curPassword"
              v-model="curPassword"
              placeholder="Contraseña Actual"
            />
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Nueva contraseña:</label>
            <input
              type="password"
              class="form-control"
              id="newPassword"
              v-model="newPassword"
              placeholder="Nueva contraseña"
            />
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-save-changes">Actualizar contraseña</button>
          </div>
        </form>

        <router-link to="/ajustes" class="btn-back">Volver</router-link>
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
import axios from 'axios'
import { ref } from 'vue'

const username = ref(localStorage.getItem('username') || '')
const email = ref(localStorage.getItem('email') || '')
const newPassword = ref('')
const curPassword = ref('')

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

function showCustomModal(title, message) {
  modalTitle.value = title
  modalMessage.value = message
  showModal.value = true
}
function closeCustomModal() {
  showModal.value = false
}

function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// Valida contraseña actual (llamada a backend)
const validaPassword = async (password, nombreUsuario) => {
  try {
    const response = await axios.post('http://localhost:3000/api/usuarios/validaPassword', {
      nombre: nombreUsuario,
      password: password
    })
    return response.data.valid
  } catch (error) {
    console.error('Error en la validación:', error.response?.data || error.message)
    return false
  }
}

// Guardar usuario y correo
const saveUserData = async () => {
  if (username.value === '' || email.value === '') {
    showCustomModal('Error al Guardar', 'Por favor, complete los campos de usuario y correo.')
    return
  }

  if (!isValidEmail(email.value)) {
    showCustomModal('Error de Validación', 'Por favor, ingrese un correo electrónico válido.')
    return
  }

  try {
    const payload = {
      nombreUsuarioActual: localStorage.getItem('username'),
      nuevoNombreUsuario: username.value,
      correo: email.value
    }

    const response = await axios.patch(
      'http://localhost:3000/api/usuarios/actualizarDatosPerfil',
      payload
    )
    showCustomModal('Cambios Guardados', '¡Usuario y correo actualizados correctamente!')
    localStorage.setItem('username', username.value)
    localStorage.setItem('email', email.value)
  } catch (error) {
    showCustomModal('Error', 'No se pudieron guardar los cambios.')
    console.error(error.response?.data || error.message)
  }
}

// Guardar contraseña
const savePassword = async () => {
  if (newPassword.value === '') {
    showCustomModal('Error', 'Por favor, ingrese una nueva contraseña.')
    return
  }
  if (curPassword.value === '') {
    showCustomModal('Error', 'Por favor, ingrese la contraseña actual para confirmar.')
    return
  }

  const correctPass = await validaPassword(curPassword.value, localStorage.getItem('username'))
  if (!correctPass) {
    showCustomModal('Error', 'Contraseña actual incorrecta.')
    return
  }

  try {
    const payload = {
      nombreUsuario: localStorage.getItem('username'),
      nuevaPassword: newPassword.value
    }

    await axios.patch('http://localhost:3000/api/usuarios/actualizarPassword', payload)

    showCustomModal('Éxito', 'Contraseña actualizada correctamente.')
    newPassword.value = ''
    curPassword.value = ''
  } catch (error) {
    showCustomModal('Error', 'No se pudo actualizar la contraseña.')
    console.error(error.response?.data || error.message)
  }
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