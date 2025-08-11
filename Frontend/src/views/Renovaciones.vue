<template>
  <div class="page">
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="digitbus" class="logo" />
      <nav>
        <router-link to="/home">Inicio</router-link>
        <router-link to="/historial">Historial</router-link>
        <router-link to="/pago-sucursal">Recargas</router-link>
        <router-link to="/Solicitudes">Solicitar</router-link>
        <router-link to="/Conocenos">Conócenos</router-link>
      </nav>
    </header>

    <main class="container">
      <div class="intro">
        <h1>Trámite de <span class="accent">{{ accionTitle }}</span></h1>
        <p class="hint">Selecciona el tipo de beneficio que deseas <b>{{ accionTitle }}</b></p>
      </div>

      <div class="grid">
        <!-- Columna izquierda: selección -->
        <section class="selector">
          <label class="label">¿Qué deseas hacer?</label>
          <div class="select-wrap">
            <select v-model="accion" @change="validaTipo">
              <option value="">Ninguno</option>
              <option value="renovacion">Renovación</option>
              <option value="extravio">Extravío</option>
            </select>
            <span class="chev">▾</span>
          </div>

          <div class="cards">
            <button class="card"
              :class="{ active: tipoSeleccionado === 'estudiante', disabled: accion === 'renovacion' && tipoSeleccionado !== 'estudiante' }"
              @click="pickTipo('estudiante')">
              Estudiantes
            </button>

            <button class="card" :class="{ active: tipoSeleccionado === 'tercera', disabled: accion === 'renovacion' }"
              @click="pickTipo('tercera')">
              Personas de la tercera edad
            </button>

            <button class="card"
              :class="{ active: tipoSeleccionado === 'discapacidad', disabled: accion === 'renovacion' }"
              @click="pickTipo('discapacidad')">
              Personas con discapacidad
            </button>

            <button class="card" :class="{ active: tipoSeleccionado === 'general', disabled: accion === 'renovacion' }"
              @click="pickTipo('general')">
              General
            </button>
          </div>

          <p v-if="accion === 'renovacion'" class="note">
            * La renovación solo aplica para <b>Tarjeta Estudiante</b>.
          </p>
        </section>

        <!-- Columna derecha: panel de documentos -->
        <section class="panel" v-if="accion && tipoSeleccionado">
          <div class="panel-content">
            <h3>Documentación requerida para {{ panelTitle }}</h3>

            <!-- Renovación (solo estudiante): comprobante -->
            <template v-if="accion === 'renovacion'">
              <div class="field">
                <label>Comprobante (pago/inscripción vigentes)</label>
                <input class="file" type="file" @change="subirArchivo($event, 'comprobante')" />
                <small>Formato JPG/PNG/PDF — máx 2MB</small>
              </div>
            </template>

            <!-- Extravío -->
            <template v-else>
              <!-- General: voucher -->
              <template v-if="tipoSeleccionado === 'general'">
                <div class="field">
                  <label>Voucher</label>
                  <input class="file" type="file" @change="subirArchivo($event, 'voucher')" />
                  <small>Voucher de pago del Pagobus</small>
                </div>
              </template>

              <!-- Discapacidad -->
              <template v-else-if="tipoSeleccionado === 'discapacidad'">
                <div class="field">
                  <label>Documento del DIF / constancia médica</label>
                  <input class="file" type="file" @change="subirArchivo($event, 'comprobante')" />
                </div>
                <div class="field">
                  <label>Identificación oficial</label>
                  <input class="file" type="file" @change="subirArchivo($event, 'identificacion')" />
                </div>
                <div class="field">
                  <label>Foto reciente (tipo pasaporte)</label>
                  <input class="file" type="file" @change="subirArchivo($event, 'foto')" />
                  <small>Formato JPG o PNG — máx 2MB</small>
                </div>
              </template>

              <!-- Estudiante / Tercera edad -->
              <template v-else>
                <div class="field">
                  <label>Comprobante</label>
                  <input class="file" type="file" @change="subirArchivo($event, 'comprobante')" />
                </div>
                <div class="field">
                  <label>Identificación oficial</label>
                  <input class="file" type="file" @change="subirArchivo($event, 'identificacion')" />
                </div>
                <div class="field">
                  <label>Foto reciente (tipo pasaporte)</label>
                  <input class="file" type="file" @change="subirArchivo($event, 'foto')" />
                  <small>Formato JPG o PNG — máx 2MB</small>
                </div>
              </template>
            </template>

            <div class="field">
              <label>Sucursal de entrega</label>
              <div class="select-wrap light">
                <select v-model="sucursal">
                  <option value="">Seleccione sucursal</option>
                  <option v-for="s in sucursales" :key="s">{{ s }}</option>
                </select>
                <span class="chev">▾</span>
              </div>
            </div>

            <button class="btn" :disabled="enviando" @click="enviar">
              {{ enviando ? 'Enviando...' : 'Enviar documentos' }}
            </button>

            <ul v-if="documentos.length" class="files-list">
              <li v-for="(d, i) in documentos" :key="i">
                <span class="dot"></span>{{ d.nombre }} <em>({{ d.tipo }})</em>
              </li>
            </ul>
          </div>
          <div class="panel-art" aria-hidden="true"></div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { renovarYExtravios, solicitudExtravios } from '@/Services/renovacionesYextravios.js'
import axios from 'axios'

const accion = ref('') // 'renovacion' | 'extravio'
const tipoSeleccionado = ref('')
const documentos = ref([])
const sucursal = ref('')
const enviando = ref(false)

const sucursales = [
  'Terminal San Jerónimo',
  'Terminal San Juan Bosco',
  'Terminal Timoteo Lozano',
  'Terminal Maravillas',
  'Terminal Delta',
  'Micro Estación Santa Rita',
  'Terminal Portales de la Arboleda'
]

const accionTitle = computed(() =>
  accion.value === 'extravio' ? 'extravío' :
    accion.value === 'renovacion' ? 'renovación' : ''
)




const validaTipo = () => {
  if (accion.value === 'renovacion') {
    var idPersonal = localStorage.getItem('idPersonal');
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/api/renovaciones/tarjetas/' + idPers1onal, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      const tarjetas = response.data.tarjetas || [];

      console.log("Datos crudos de tarjetas:", tarjetas);

      // Recorremos para ver cada tipo real
      tarjetas.forEach(t => {
        console.log("Tipo recibido:", t.TIPO, "| Tipo en minúsculas:", t.TIPO?.toLowerCase());
      });

      const anyEstudiante = tarjetas.some(
        t => t.TIPO?.toLowerCase().trim() === 'estudiante'
      );

      if (anyEstudiante) {
        console.log("Sí hay tarjeta de estudiante");
      } else {
        alert("No tienes tarjeta de tipo estudiante.");
        accion.value = '';
      }
    })
      .catch(error => {
        console.error('Error al obtener tarjetas:', error.response?.data || error.message);
      });

  }
}

const panelTitle = computed(() => {
  const map = { estudiante: 'Personas Estudiantes', tercera: 'Personas de la tercera edad', discapacidad: 'Personas con Discapacidad', general: 'General' }
  const tipo = map[tipoSeleccionado.value] || 'Ninguno'
  return `${accionTitle.value || 'solicitud'} de ${tipo}`
})

function pickTipo(t) {
  if (accion.value === 'renovacion' && t !== 'estudiante') return
  tipoSeleccionado.value = t
}

const convertirABase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })

async function subirArchivo(e, tipoDoc) {
  const f = e.target.files?.[0]
  if (!f) return
  const base64 = await convertirABase64(f)
  documentos.value.push({
    tipo: tipoDoc,
    nombre: f.name,
    base64Data: String(base64).split(',')[1]
  })
}

const tipoBackend = (t) => {
  if (t === 'estudiante') return 'ESTUDIANTE'    // <- para que pase la validación de renovación
  if (t === 'tercera') return 'TERCERA_EDAD'
  if (t === 'discapacidad') return 'DISCAPACIDAD'
  if (t === 'general') return 'GENERAL'
  return ''
}

function validar() {
  if (!accion.value) return 'Selecciona una acción'
  if (!tipoSeleccionado.value) return 'Selecciona un tipo de tarjeta'
  if (accion.value === 'renovacion' && tipoSeleccionado.value !== 'estudiante') {
    return 'La renovación solo aplica para Estudiantes'
  }
  if (!sucursal.value) return 'Selecciona una sucursal de entrega'
  if (!documentos.value.length) return 'Agrega al menos un archivo'
  if (accion.value === 'renovacion') {
    const tieneComprobante = documentos.value.some(d => d.tipo === 'comprobante')
    if (!tieneComprobante) return 'Adjunta el comprobante para renovar'
  }
  if (accion.value === 'extravio') {
    const requiereId = tipoSeleccionado.value !== 'general' // general sólo voucher
    const tieneFoto = documentos.value.some(d => d.tipo === 'foto')
    const tieneId = documentos.value.some(d => d.tipo === 'identificacion')
    const tieneVoucher = documentos.value.some(d => d.tipo === 'voucher')
    if (tipoSeleccionado.value === 'general' && !tieneVoucher) return 'Adjunta el voucher'
    if (requiereId && (!tieneId || !tieneFoto)) return 'Adjunta identificación y foto'
  }
  return null
}

async function enviar() {
  const error = validar()
  if (error) return alert(error)

  const payload = {
    tipo: tipoBackend(tipoSeleccionado.value),
    documentos: documentos.value,
    observaciones: `Sucursal: ${sucursal.value}`
  }

  try {
    enviando.value = true
    const resp = accion.value === 'renovacion'
      ? await renovarYExtravios(payload)   // POST /api/renovaciones/renovacion
      : await solicitudExtravios(payload)  // POST /api/renovaciones/extravios

    if (resp.data?.success) {
      alert('Tu trámite fue enviado correctamente')
      documentos.value = []
      sucursal.value = ''
      tipoSeleccionado.value = ''
      accion.value = ''
    } else {
      alert(resp.data?.message || 'Error inesperado')
    }
  } catch (err) {
    console.error(err)
    alert('No se pudo enviar el trámite')
  } finally {
    enviando.value = false
  }
}
watch(accion, (nuevaAccion) => {
  if (nuevaAccion === 'renovacion') {
    tipoSeleccionado.value = 'estudiante'
  }
})
</script>

<style scoped>
/* Layout base */
.page {
  background: #f7f9fc;
  min-height: 100vh;
  font-family: Inter, system-ui, -apple-system, Arial, sans-serif;
  color: #1f2937;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .05);
}

.logo {
  height: 32px;
}

.top-nav nav a {
  margin-left: 1.5rem;
  color: #1e3a8a;
  text-decoration: none;
  font-weight: 600;
}

.top-nav nav a:hover {
  color: #2563eb;
}

.container {
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1rem;
}

.intro h1 {
  font-size: clamp(1.6rem, 2.2vw, 2.25rem);
  margin: .25rem 0 .25rem;
}

.accent {
  color: #2563eb;
}

.hint {
  color: #4b5563;
  margin-top: .25rem;
}

/* Grid principal */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.25rem;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 420px 1fr;
    align-items: start;
  }
}

/* Selector lateral */
.selector .label {
  font-weight: 700;
  margin-bottom: .5rem;
  display: block;
  color: #111 !important;
}

.select-wrap {
  position: relative;
  width: 100%;
  background: #ffffff;
  color: #111;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  color: #111;
  border: none;
  width: 100%;
  padding: .9rem 2.5rem .9rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.select-wrap .chev {
  position: absolute;
  right: .9rem;
  top: 50%;
  transform: translateY(-50%);
  color: #111;
  opacity: .6;
}

.cards {
  margin-top: .75rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.card {
  text-align: left;
  border: none;
  border-radius: 12px;
  background: #1f2937;
  color: #e5e7eb;
  padding: .9rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform .12s ease, background .2s ease;
}

.card:hover {
  transform: translateY(-1px);
  background: #243041;
}

.card.active {
  outline: 2px solid #2563eb;
  background: #22314a;
}

.card.disabled {
  opacity: .45;
  cursor: not-allowed;
}

/* Panel derecho */
.panel {
  display: grid;
  grid-template-columns: 1fr;
  background: #111827;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, .08);
}

@media (min-width: 900px) {
  .panel {
    grid-template-columns: 1.25fr .9fr;
  }
}

.panel-content {
  padding: 1.5rem;
  color: #f3f4f6;
}

.panel-content h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.field {
  margin: .85rem 0;
}

.field label {
  display: block;
  margin-bottom: .4rem;
  font-weight: 600;
  color: #f3f4f6;
}

.field small {
  color: #9ca3af;
  display: block;
  margin-top: .35rem;
}

.file {
  display: block;
  width: 100%;
  padding: .65rem .7rem;
  border-radius: 10px;
  background: #0b1220;
  border: 1px solid #1f2937;
  color: #e5e7eb;
}

.select-wrap.light {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.select-wrap.light select {
  color: #000;
  background: transparent;
  border: none;
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

.btn {
  margin-top: 1rem;
  background: #51c638;
  color: #fff;
  border: none;
  font-weight: 800;
  padding: .9rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 6px 0 #3b9a2b;
  transition: transform .1s ease, filter .2s ease;
}

.btn:hover {
  filter: brightness(.98);
  transform: translateY(-1px);
}

.btn:disabled {
  background: #9ca3af;
  box-shadow: none;
  cursor: not-allowed;
}

.files-list {
  margin-top: 1rem;
  padding-left: 0;
  list-style: none;
}

.files-list li {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin: .35rem 0;
  color: #d1d5db;
}

.files-list li em {
  color: #9ca3af;
  font-style: normal;
}

.files-list .dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #2563eb;
  display: inline-block;
}

.note {
  color: #6b7280;
  margin-top: .75rem;
  font-size: .95rem;
}

.panel-art {
  background: url('@/assets/img/fondo-solicitud.png') center/cover no-repeat;
  min-height: 260px;
}
</style>