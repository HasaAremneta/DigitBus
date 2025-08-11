<template>
  <div class="historial-page">
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
        <router-link to="/home">Inicio</router-link>
        <router-link to="/pago-sucursal">Recargas</router-link>
        <router-link to="/Solicitudes">Solicitar</router-link>
        <router-link to="/Renovaciones">Renovar o Extravio</router-link>
        <router-link to="/Conocenos">Conócenos</router-link>
      </nav>
    </header>

    <main class="contenido">
      <h1>Mis Tarjetas y Saldos</h1>

      <div v-if="tarjetas.length === 0">No tienes tarjetas registradas.</div>

      <div v-for="tarjeta in tarjetas" :key="tarjeta.IDTARJETA" class="tarjeta-box">
        <h2>Tarjeta: {{ tarjeta.NUMTARJETA }} ({{ tarjeta.TIPO }})</h2>
        <div class="saldo-box">
          Saldo actual: ${{ tarjeta.SALDO.toFixed(2) }} MXN
        </div>

        <h3>Historial de recargas</h3>
        <ul v-if="recargasPorTarjeta[tarjeta.IDTARJETA]?.length > 0" class="lista-recargas">
          <li v-for="recarga in recargasPorTarjeta[tarjeta.IDTARJETA]" :key="recarga.IDRECARGA" class="item-recarga">
            <span class="fecha">{{ new Date(recarga.FECHARECARGA).toLocaleDateString('es-MX') }}</span>
            <span class="cantidad">+ ${{ recarga.MONTO.toFixed(2) }}</span>
            <span class="establecimiento" v-if="recarga.NOMBREESTABLECIMIENTO">({{ recarga.NOMBREESTABLECIMIENTO }})</span>
          </li>
        </ul>
        <p v-else>No hay recargas para esta tarjeta.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tarjetas = ref([])
const recargasPorTarjeta = ref({})  // clave: idTarjeta, valor: array de recargas

const cargarTarjetasYRecargas = async () => {
  const idPersonal = localStorage.getItem('idPersonal')
  if (!idPersonal) {
    console.error('No hay idPersonal en localStorage')
    return
  }

  try {
    // Obtener tarjetas
    const resTarjetas = await axios.get(`http://localhost:3000/api/historial/tarjetas/${idPersonal}`)
    tarjetas.value = resTarjetas.data.tarjetas || []

    // Obtener recargas para cada tarjeta en paralelo
    await Promise.all(
      tarjetas.value.map(async (tarjeta) => {
        const resRecargas = await axios.get(`http://localhost:3000/api/historial/recargas/${tarjeta.IDTARJETA}`)
        recargasPorTarjeta.value[tarjeta.IDTARJETA] = resRecargas.data.recargas || []
      })
    )
  } catch (error) {
    console.error('Error cargando tarjetas o recargas:', error)
  }
}

onMounted(() => {
  cargarTarjetasYRecargas()
})
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
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  text-align: center;
}
.lista-recargas {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}
.item-recarga {
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
}
.fecha {
  flex: 1;
}
.cantidad {
  flex: 1;
  font-weight: bold;
  color: #1a6dff;
  text-align: right;
}
.establecimiento {
  flex: 2;
  text-align: right;
  font-style: italic;
  color: #666;
}
.tarjeta-box {
  margin-bottom: 3rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
</style>
