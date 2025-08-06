<template>
<div class="solicitud-tarjeta">
<!-- Columna izquierda: selección -->
<div class="columna-izquierda">
<img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
<h2>Trámite de solicitud</h2>
<p>Selecciona el tipo de tarjeta que deseas solicitar</p>
<select v-model="tipoSeleccionado">
<option value="">Ninguno</option>
<option value="estudiante">Estudiante</option>
<option value="tercera">Persona de la tercera edad</option>
<option value="discapacidad">Persona con discapacidad</option>
</select>
</div>
 
    <!-- Columna central: formulario -->
<div class="columna-formulario" v-if="tipoSeleccionado">
<h3>Solicitud: <span>{{ labelTipo }}</span></h3>
<form @submit.prevent="enviarSolicitud">
<input type="text" placeholder="Nombre completo" required />
<input type="text" placeholder="CURP" required />
<input type="text" placeholder="Número de tarjeta actual" required />
<input type="email" placeholder="Correo electrónico" required />
<input type="tel" placeholder="Teléfono" required />
<input type="text" placeholder="Dirección" required />
 
        <!-- Campos extra según tipo -->
<template v-if="tipoSeleccionado === 'estudiante'">
<input type="text" placeholder="Escuela" required />
<input type="text" placeholder="Matrícula" required />
</template>
 
        <template v-if="tipoSeleccionado === 'discapacidad'">
<input type="text" placeholder="Tipo de discapacidad" required />
<input type="text" placeholder="Número de carnet" required />
</template>
 
        <button type="submit">Enviar solicitud</button>
</form>
</div>
 
    <!-- Columna derecha: fondo decorativo -->
<div class="columna-derecha"></div>
</div>
</template>
 
<script setup>
import { ref, computed } from 'vue'
 
const tipoSeleccionado = ref('')
 
const labelTipo = computed(() => {
  switch (tipoSeleccionado.value) {
    case 'estudiante': return 'Estudiante'
    case 'tercera': return 'Persona de la tercera edad'
    case 'discapacidad': return 'Persona con discapacidad'
    default: return 'Ninguno'
  }
})
 
const enviarSolicitud = () => {
  alert('Solicitud enviada correctamente.')
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
 
select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
 
.columna-formulario {
  flex: 1;
  background: #1a1a2e;
  color: white;
  padding: 2rem;
}
 
.columna-formulario form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
 
.columna-formulario input,
.columna-formulario button {
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 1rem;
}
 
.columna-formulario input {
  border: none;
}
 
.columna-formulario button {
  background: #51c638;
  color: white;
  border: none;
  font-weight: bold;
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