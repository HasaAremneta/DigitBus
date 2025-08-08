<template>
  <div class="solicitud-tarjeta">
    <!-- Columna izquierda: selección -->
    <div class="columna-izquierda">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <h2>Trámite de <strong>solicitud</strong></h2>
      <p>Selecciona el tipo de beneficio que deseas <strong>solicitar</strong></p>
      <select v-model="tipoSeleccionado">
        <option value="">Ninguno</option>
        <option value="estudiante">Estudiantes</option>
        <option value="tercera">Personas de la tercera edad</option>
        <option value="discapacidad">Personas con discapacidad</option>
        <!-- <option value="general">General</option> -->
      </select>
    </div>

    <!-- Columna central: formulario -->
    <div class="columna-formulario" v-if="tipoSeleccionado">
      <h3>Solicitud para <span>{{ labelTipo }}</span></h3>

      <!-- Archivos por tipo -->
      <template v-if="tipoSeleccionado === 'discapacidad'">
        <label>Documento del DIF o institución médica:</label>
        <input type="file" @change="subirArchivo($event, 'discapacidad')" />
        <small>Credencial del DIF o constancia médica oficial que acredite la discapacidad.</small>
      </template>

      <template v-if="tipoSeleccionado === 'estudiante'">
        <label>Comprobante de estudios:</label>
        <input type="file" @change="subirArchivo($event, 'comprobante')" />
        <small>Recibo de inscripción, colegiatura o constancia de estudios vigente.</small>
      </template>

      <template v-if="tipoSeleccionado === 'tercera'">
        <label>Comprobante de edad:</label>
        <input type="file" @change="subirArchivo($event, 'comprobante')" />
        <small>Documento que acredite tener 60 años o más.</small>
      </template>
      
      <!-- Solo mostrar el cuadro para subir el voucher si es tipo 'general' -->
      <!-- <template v-if="tipoSeleccionado === 'general'">
        <label>Voucher:</label>
        <input type="file" @change="subirArchivo($event, 'vaucher')" />
        <small>Sube el voucher de pago del Pagobus.</small>
      </template> -->

      <!-- Solo mostrar Identificación oficial y Foto cuando no sea 'general' -->
      <template v-if="tipoSeleccionado !== 'general'">
        <label>Identificación oficial</label>
        <input type="file" @change="subirArchivo($event, 'identificación')" />

        <label>Foto reciente (tipo pasaporte)</label>
        <input type="file" @change="subirArchivo($event, 'foto')" />
        <small>Formato JPG o PNG, máximo 2MB</small>
      </template>

      <!-- Sucursal -->
      <label>Seleccione para entrega:</label>
      <select v-model="sucursal">
        <option value="">Seleccione sucursal</option>
        <option v-for="s in sucursales" :key="s">{{ s }}</option>
      </select>

      <button @click="enviarSolicitud">Enviar solicitud</button>
    </div>

    <!-- Columna derecha: imagen -->
    <div class="columna-derecha"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { solicitudRegistro } from '@/Services/solicitudes.js'
import { login } from '@/Services/auth.js'

async function loginUser(credentials){
  try{
    const response = await login(credentials)
    const { token, idPersonal } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('idPersonal', idPersonal)

  }catch (error) {
    console.error('Error de inicio de sesión:', error)
  }
}

//const idUsuario = localStorage.getItem('idUsuario'); 
const tipoSeleccionado = ref('')
const metodo = ref('')
const sucursal = ref('')
const documentos = ref([])
const correo = ref('')
const telefono = ref('')

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const router = useRouter()

const sucursales = [
  'Terminal San Jerónimo',
  'Terminal San Juan Bosco',
  'Terminal Timoteo Lozano',
  'Terminal Maravillas',
  'Terminal Delta',
  'Micro Estación Santa Rita',
  'Terminal Portales de la Arboleda'
]

const labelTipo = computed(() => {
  switch (tipoSeleccionado.value) {
    case 'estudiante': return 'Estudiantes'
    case 'tercera': return 'Personas de la tercera edad'
    case 'discapacidad': return 'Personas con Discapacidad'
    default: return 'Ninguno'
  }
})

const subirArchivo = async (event, tipoDoc) => {
  const archivo = event.target.files[0]
  if (!archivo) return
  const base64 = await convertirABase64(archivo)
  documentos.value.push({ tipo: tipoDoc, nombre: archivo.name, base64Data: base64.split(',')[1] })
}

const convertirABase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

const tipoBackend = (tipo) => {
  if (tipo === 'estudiante') return 'ESTUDIANTE'
  if (tipo === 'tercera'|| tipo === 'discapacidad') return 'GENERALMAYOR'
  if (tipo === 'general') return 'GENERAL'
  return ''
}
// Obtener el idPersonal del almacenamiento local
const idPersonal = localStorage.getItem('idPersonal');
if (!idPersonal) {
  console.error("No se encontró idPersonal. Asegúrate de que el usuario esté autenticado.");
}

const enviarSolicitud = async () => {
  const payload = {
    tipo: tipoBackend(tipoSeleccionado.value),
    idPersonal: idPersonal,// mandar el idPersonal del usuario autenticado
    observaciones: `Método: ${metodo.value === 'correo' ? correo.value : telefono.value}. Sucursal: ${sucursal.value}`,
    documentos: documentos.value
  }

  try {
    const response = await solicitudRegistro(payload)
    if (response.data.success) {
      showCustomModal('Solicitud Enviada', 'Tu solicitud fue enviada correctamente.')
      setTimeout(() => {
        router.push('/home')
      }, 1500)
    } else {
      showCustomModal('Error en solicitud', response.data.message || 'Error inesperado.')
    }
  } catch (err) {
    console.error(err)
    showCustomModal('Error de red', 'No se pudo conectar con el servidor.')
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
.solicitud-tarjeta {
  display: flex;
  min-height: 100vh;
}

.columna-izquierda {
  flex: 1;
  background: #f7f9fc;
  padding: 2rem;
}

.logo {
  height: 32px;
  margin-bottom: 1rem;
}

.columna-izquierda h2 {
  margin-bottom: 0.5rem;
}

select,
input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.4rem 0;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.columna-formulario {
  flex: 1;
  background: #1a1a2e;
  color: white;
  padding: 2rem;
}

.columna-formulario label {
  margin-top: 1rem;
  font-weight: bold;
  display: block;
}

.columna-formulario small {
  color: #aaa;
  font-size: 0.75rem;
  margin-bottom: 1rem;
  display: block;
}

.columna-formulario button {
  background: #51c638;
  color: white;
  padding: 0.7rem;
  margin-top: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.columna-derecha {
  flex: 1;
  background-image: url('@/assets/img/fondo-solicitud.png');
  background-size: cover;
  background-position: center;
  border-left: 2px solid white;
}
</style>