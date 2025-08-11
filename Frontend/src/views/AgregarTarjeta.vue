<template>
  <div>
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
        <router-link to="/home">Inicio</router-link>
        <router-link to="/conocenos">Conócenos</router-link>
      </nav>
    </header>

    <button class="btn-new-card" @click="validacantarjetas">Agregar nueva tarjeta</button>

    <div class="container container-main" id="formCard">
      <div class="card-form">
        <i class="pi pi-times close-btn" @click="closeForm"></i>
        <h2>Agregar tarjeta</h2>
        <form @submit.prevent="saveCard">
          <div class="mb-3">
            <label for="cardNumber" class="form-label">Número de tarjeta:</label>
            <input type="text" class="form-control" id="cardNumber" v-model="cardNumber" @input="formatCardNumber"
              placeholder="xxxx-xxxx-xxxx-xxxx" maxlength="19">
          </div>
          <div class="mb-3">
            <label for="cardType" class="form-label">Selecciona el tipo de tarjeta:</label>
            <select class="form-select" id="cardType" v-model="cardType">
              <option value="" disabled>Tipo de tarjeta</option>
              <option value="ESTUDIANTE">Estudiante</option>
              <option value="ADULTOM/CAPACIDADESD">Adulto Mayor / Capacidades Diferentes</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-save-card">Guardar tarjeta</button>
          </div>
        </form>
      </div>
    </div>

    <div class="tbl-tarjetas">
      <table>
        <thead>
          <tr>
            <th>No. Tarjeta</th>
            <th>Tipo</th>
            <th>Saldo</th>
            <th>Fecha Emision</th>
            <th>Fecha Vencimiento</th>
          </tr>

        </thead>
        <tbody>
          <tr v-for="(tarjeta, index) in tarjetasU" :key="tarjeta.IDTARJETA">
            <td>{{ tarjeta.NUMTARJETA }}</td>
            <td>{{ tarjeta.TIPO }}</td>
            <td>{{ tarjeta.SALDO }}</td>
            <td>{{ new Date(tarjeta.FECHAEMISION).toLocaleDateString() }}</td>
            <td>{{ new Date(tarjeta.FECHAVECIMIENTO).toLocaleDateString() }}</td>
            <td>
              <button @click="eliminarTarjeta(tarjeta.IDTARJETA)" class="p-button-rounded p-button-danger p-button-sm">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>

      </table>
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
import { onMounted, ref } from 'vue'

const cardNumber = ref('')
const cardType = ref('')
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const tarjetasU = ref([])





const obtenerTarjetasUsuario = () => {
  const idPersonal = localStorage.getItem('idPersonal');
  axios('http://localhost:3000/api/usuarios/tarjetasU/' + idPersonal)
    .then(response => {
      tarjetasU.value = response.data.recordset;
      console.log(tarjetasU.value);
    });
}
onMounted(obtenerTarjetasUsuario);

const validacantarjetas = () => {
  if (tarjetasU.value.length >= 3) {
    showCustomModal('Error', 'No puedes guardar mas de 3 tarjetas en tu cuenta.')

    console.warn(modalMessage.value);
  } else {
    showForm();
  }
}

function saveCard() {
  if (cardNumber.value.length === 19 && cardType.value !== '') {
    const idPersonal = localStorage.getItem('idPersonal');
    const token = localStorage.getItem('token');

    const nuevaTarjeta = {
      idPersonal: idPersonal,
      numTarjeta: cardNumber.value,
      tipo: cardType.value
    };

    axios.post('http://localhost:3000/api/usuarios/nuevaTarjeta', nuevaTarjeta)
      .then(response => {
        console.log('Tarjeta creada:', response.data);
        showCustomModal('Tarjeta Guardada', 'La tarjeta ha sido guardada exitosamente.')
        obtenerTarjetasUsuario();
      })
      .catch(error => {
        console.error('Error al agregar tarjeta:', error.response?.data || error.message);
        showCustomModal('Error al Guardar', 'Por favor, verifique que el número de tarjeta sea válido (XXXX-XXXX-XXXX-XXXX) y seleccione un tipo de tarjeta.')
      });


    cardNumber.value = ''
    cardType.value = ''
  } else {
    showCustomModal('Error al Guardar', 'Por favor, ingrese un número de tarjeta válido (XXXX-XXXX-XXXX-XXXX) y seleccione un tipo de tarjeta.')
  }
}

const eliminarTarjeta = async (idTarjeta) => {
  try {
    const confirmacion = confirm('¿Seguro que deseas eliminar esta tarjeta?');
    if (!confirmacion) return;

    const response = await axios.delete(`http://localhost:3000/api/usuarios/eliminarTarjeta/${idTarjeta}`);

    if (response.data.success) {
      tarjetasU.value = tarjetasU.value.filter(t => t.IDTARJETA !== idTarjeta);
      modalMessage.value = 'Tarjeta eliminada correctamente.';
    } else {
      modalMessage.value = response.data.message || 'No se pudo eliminar la tarjeta.';
    }
  } catch (error) {
    console.error('Error al eliminar tarjeta:', error);
    modalMessage.value = 'Ocurrió un error al eliminar la tarjeta.';
  }
};


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

const showForm = () => {
  const form = document.getElementById("formCard");
  form.style.display = 'flex';
}
const closeForm = () => {
  const form = document.getElementById("formCard");
  form.style.display = 'none';
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

.tbl-tarjetas {
  display: flex;
  width: 100%;
  align-items: center;
  justify-items: center;
}

.tbl-tarjetas table {
  width: 100%;
  background-color: white;
  border-radius: 10px;
  margin: 2%;
}

.tbl-tarjetas table th {
  background-color: #0056b3;
  color: white;
  font-size: large;
  padding: 15px;
}

.tbl-tarjetas table td {
  border: 2px solid #0056b3;
  margin: 10px;
}

.container-main {
  margin-top: 3rem;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 120px);
  position: absolute;
  z-index: 99;
  display: none;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #dc3545;
}

.card-form {
  background-color: #ffffff;
  padding: 3rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 500px;
  position: relative;
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

.form-control,
.form-select {
  border: none;
  border-bottom: 2px solid #007bff;
  border-radius: 0;
  padding: 0.75rem 0.5rem;
  margin-bottom: 2.5rem;
  box-shadow: none !important;
  font-size: 1.1rem;
  color: #343a40;
}

.form-control:focus,
.form-select:focus {
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

.btn-new-card {
  border: none;
  border-radius: 5px;
  background-color: rgb(63, 131, 63);
  color: white;
  padding: 10px;
  margin: 20px 40% 20px 40%;
  font-size: x-large;
}
</style>