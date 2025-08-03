<template>
  <div class="pago-sucursal">
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
        <router-link to="/home">Inicio</router-link>
        <router-link to="/conocenos">Conócenos</router-link>
      </nav>
    </header>

    <main class="contenido">
      <h1>Elige tu <strong>método de pago</strong> en sucursal</h1>

      <section class="seccion-central">
        <!-- TARJETA -->
        <div class="tarjeta box">
          <h2>Tarjeta</h2>
          <p>Selecciona el método de pago</p>
          <div class="btn-group">
          <button
            :class="['btn-opcion', { active: metodoPago === 'debito' }]"
            @click="seleccionarMetodo('debito')"
          >
            Débito
          </button>
          <button
            :class="['btn-opcion', { active: metodoPago === 'credito' }]"
            @click="seleccionarMetodo('credito')"
          >
            Crédito
          </button>
        </div>

          <label>Nombre del propietario</label>
          <input type="text" placeholder="José Carlos Camarena Hernández" v-model="nombre" />

          <label>Número de tarjeta</label>
          <input type="text" placeholder="**** **** **** ****" v-model="tarjeta" />

          <div class="input-flex">
            <div>
              <label>Expiración</label>
              <input class="short-input" type="text" placeholder="MM/AA" v-model="expiracion" />
            </div>
            <div>
              <label>CVV</label>
              <input class="short-input" type="text" placeholder="000" v-model="cvv" />
            </div>
          </div>

          <button
            class="btn-pagar"
            @click="formularioValido ? enviarPago() : null"
          >
            Pagar
          </button>



          <p class="nota">Usamos tus datos de forma responsable y privada.</p>
        </div>

        <!-- TRANSFERENCIA -->
        <div class="transferencia box">
          <h2>Transferencia</h2>
          <p><strong>Detalles para la <span class="azul">transferencia</span></strong></p>
          <p>Realiza tu transferencia a:</p>
          <p><strong>Banco:</strong> Asumaquina</p>
          <p><strong>Cuenta:</strong> 1234567890</p>
          <p><strong>CLABE:</strong> 012345678901234567</p>

          <p class="copy-qr">También puedes escanear este código QR para hacer el pago directo.</p>
          <img src="@/assets/img/qr-fake.png" alt="QR de pago" class="qr-img" />
        </div>

        <!-- EXTRAS -->
        <div class="extra">
          <img src="@/assets/img/promo-indrive.jpg" alt="Publicidad inDrive" class="banner" />

          <div class="guia">
            <h3>Guía <span class="azul">rápida</span></h3>
            <ol>
              <li><strong>Selecciona</strong> el medio de pago.</li>
              <li><strong>Ingresa los datos</strong> requeridos.</li>
              <li><strong>Pulsa</strong> el botón pagar.</li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const metodoPago = ref('debito')
const nombre = ref('')
const tarjeta = ref('')
const expiracion = ref('')
const cvv = ref('')

const formularioValido = computed(() => {
  return nombre.value && tarjeta.value && expiracion.value && cvv.value
})

const seleccionarMetodo = (metodo) => {
  metodoPago.value = metodo
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

.nota {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: var(--azul-marino);
}

.copy-qr {
  font-size: 0.9rem;
  margin: 0.5rem 0;
  color: var(--azul-marino);
}

.qr-img {
  width: 180px;
  height: auto;
  border-radius: 10px;
  margin-top: 0.5rem;
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
