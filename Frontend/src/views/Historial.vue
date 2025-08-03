<template>
  <div class="historial-page">
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
        <router-link to="/home">Inicio</router-link>
        <router-link to="/conocenos">Conócenos</router-link>
      </nav>
    </header>

    <main class="contenido">
      <h1>Saldo actual</h1>
      <div class="saldo-box">
        $<span>{{ saldo }}</span> MXN
      </div>

      <div class="acciones">
      <router-link to="/pago-sucursal" class="btn-accion">Hacer recarga</router-link>
      <router-link to="/home" class="btn-accion secundario">Volver a Inicio</router-link>
      </div>


      <h2>Historial de recargas</h2>
      <ul class="lista-recargas">
        <li v-for="(recarga, index) in historial" :key="index" class="item-recarga">
          <span class="fecha">{{ recarga.fecha }}</span>
          <span class="cantidad">+ ${{ recarga.cantidad }}</span>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerHistorial } from '@/Services/historial.js'
import { useRouter } from 'vue-router'

const saldo = ref(0)
const historial = ref([])

onMounted(async () => {
  try {
    const response = await obtenerHistorial();

    // Mapea las recargas al formato que usas en la UI
    historial.value = response.data.recargas.map(item => ({
      fecha: new Date(item.FECHARECARGA).toLocaleDateString(),
      cantidad: item.MONTO,
    }));

    // Calcula el saldo sumando todos los montos de las recargas
    saldo.value = response.data.recargas.reduce((acc, r) => acc + r.MONTO, 0);

  } catch (error) {
    console.error("Error al obtener el historial:", error);
  }
})

// const saldo = ref(135.00)

// const historial = ref([
//   { fecha: '2025-07-25', cantidad: 50 },
//   { fecha: '2025-07-21', cantidad: 40 },
//   { fecha: '2025-07-15', cantidad: 45 }
// ])
</script>

<style scoped>
.historial-page {
  background-color: #f7f9fc;
  min-height: 100vh;
  font-family: 'Vertiga', sans-serif;
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

.contenido {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.saldo-box {
  background-color: #1a6dff;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.acciones {
 display: flex;
  justify-content: center; 
  gap: 1rem;
  margin: 2rem 0;
}

.btn-accion {
  background-color: var(--azul, #1a6dff);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s;
  box-shadow: 0 4px 0 #1548d6;
}

.btn-accion:hover {
  background-color: #1548d6;
}

.btn-accion.secundario {
  background-color: #ccc;
  color: #2a3547;
  box-shadow: 0 4px 0 #aaa;
}

.btn-accion.secundario:hover {
  background-color: #b2b2b2;
}


.lista-recargas {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-recarga {
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>

