<template>
  <div class="pago-sucursal">
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
        <router-link to="/home">Inicio</router-link>
        <router-link to="/historial">Historial</router-link>
        <router-link to="/Solicitudes">Solicitar</router-link>
        <router-link to="/Renovaciones">Renovar o Extravio</router-link>
        <router-link to="/Conocenos">Conócenos</router-link>
      </nav>
    </header>

    <main class="contenido">
      <h1>Elige tu <strong>método de pago</strong> en sucursal</h1>

      <section class="seccion-central">
        <!-- TARJETA -->
        <div class="tarjeta box">
          <h2>Tarjeta</h2>
          <p>Cuanto saldo deseas recargar?</p>


          <label class="lbl-monto">Monto ($mxn.):</label>
          <input class="inpt-monto" type="number" placeholder="0.00" v-model="monto" min="0" />
          <label style="margin-right: 5px;">Número de tarjeta: </label>
          <!-- <input type="text" placeholder="**** **** **** ****" v-model="tarjeta" /> -->
          <select name="" id="" v-model="tarjeta">
            <option value="" default>Selecciona tu tarjeta</option>
            <option v-for="item in tarjetas" :key="item.numTarjeta" :value="item.idTarjeta">
              {{ item.numTarjeta }} ({{ item.tipotarjeta }})
            </option>
          </select>




          <button class="btn-pagar" @click="formularioValido ? enviarPago() : null">
            Proceder al pago <i class="pi pi-receipt" style="margin-left: 2%;"></i>
          </button>




        </div>


        <!-- EXTRAS -->
        <div class="extra">
          <img src="@/assets/img/promo-indrive.jpg" alt="Publicidad inDrive" class="banner" />

          <div class="guia">
            <h3>Guía <span class="azul">rápida</span></h3>
            <ol>
              <li><strong>Ingresa</strong> monto que deseas recargar a tu tarjeta.</li>
              <li><strong>selecciona</strong> la tarjeta que vas a recargar.</li>
              <li><strong>Pulsa</strong> el botón para proceder al pago.</li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import 'primeicons/primeicons.css'
import axios from 'axios'


const monto = ref('')
const tarjeta = ref('')
const tarjetas = ref([
  { idTarjeta: 1, numTarjeta: '*******1234', tipotarjeta: 'Estudiante' },
  { idTarjeta: 2, numTarjeta: '*******5678', tipotarjeta: 'General' },
  { idTarjeta: 3, numTarjeta: '*******9012', tipotarjeta: 'Tercera Edad' },
])

const formularioValido = computed(() => {

  return monto.value && tarjeta.value

})

const enviarPago = () => {
  if (formularioValido.value) {
    // Lógica para enviar el pago

    axios.post('http://localhost:3000/api/payment/create-checkout-session', {
      monto: monto.value * 100,
      tarjeta: tarjeta.value,
    },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        console.log('Redirigiendo al pago:', response.data);
        localStorage.setItem("idTarjeta", tarjeta.value);
        localStorage.setItem("monto", monto.value);
        console.log("Tarjeta: " + tarjeta + " Monto: " + monto);
        window.location.href = response.data.url;

      }).catch(error => {
        console.error('Error al enviar el pago:', error);
        var msg = 'verifique los datos del formulario';
        if (monto.value < 10) {
          msg += ': El monto debe ser mayor a $10';
        }
        alert(msg)
      });
  } else {
    var msg = 'verifique los datos del formulario';
    if (monto.value < 10) {
      msg += ': El monto debe ser mayor a $10';
    }
    alert(msg)
    console.log('Formulario inválido')
  }
}

</script>


<style scoped>
:root {
  --verde: #51c638;
  --azul: #1a6dff;
  --azul-marino: #2a3547;
  --blanco: #ffffff;
}

.pago-sucursal {
  background-color: #f7f9fc;
  min-height: 100vh;
  font-family: 'Vertiga', sans-serif;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--blanco);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.logo {
  height: 32px;
}

.top-nav nav a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: var(--azul-marino);
  font-weight: 500;
}

.contenido {
  padding: 2rem;
  max-width: 1300px;
  margin: auto;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: var(--azul-marino);
}

.seccion-central {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.box {
  background-color: var(--blanco);
  padding: 1.5rem;
  border-radius: 12px;
  flex: 1;
  min-width: 280px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  margin-bottom: 1rem;
  background-color: var(--blanco);
  font-size: 0.95rem;
}

.short-input {
  width: 100%;
  max-width: 100px;
}

.input-flex {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.input-flex label {
  margin-right: 0.3rem;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn-opcion {
  flex: 1;
  padding: 0.5rem;
  background-color: var(--azul);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

.btn-opcion:not(.active) {
  background-color: #a3c7ff;
  opacity: 0.9;
}

.btn-opcion.active {
  background-color: #1548d6;
}

.lbl-monto {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: x-large;
}

.inpt-monto {
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-bottom: solid #ccc;
  border-radius: 6px;
  background-color: var(--blanco);
  font-size: 2.95rem;
  margin-bottom: 1rem;
}

.inpt-monto:focus {
  outline: none;
  border-color: var(--azul);
}

.btn-pagar {
  background-color: #0c7b2f !important;
  color: white;

  width: 100%;
  padding: 0.75rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 4px 0 #0c7b2f;
  text-align: center;
  font-size: 1rem;
}

.btn-pagar:hover {
  transform: scale(1.05);
  background-color: #23cd58;
}

.btn-pagar:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #0c7b2f;
}

.btn-pagar:disabled {
  background-color: #ccc !important;
  color: #666 !important;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}



.extra {
  flex: 1;
  min-width: 280px;
}

.banner {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.guia {
  position: relative;
  padding: 1rem;
  border-radius: 12px;
  background-image: linear-gradient(rgba(26, 109, 255, 0.5), rgba(26, 109, 255, 0.5)), url('@/assets/img/fondo-guia.png');
  background-blend-mode: multiply;
  background-size: cover;
  background-position: center;
  color: white;
  border: 2px solid var(--verde);
}


.guia h3 {
  margin-bottom: 1rem;
}

.guia ol {
  padding-left: 1rem;
}

.guia li {
  margin-bottom: 0.5rem;
}

.azul {
  color: var(--azul);
}
</style>
