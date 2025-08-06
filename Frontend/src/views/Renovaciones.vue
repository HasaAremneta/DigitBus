<template>
<div class="renovacion">
<img src="@/assets/img/logo_digitbus_white.svg" class="logo" alt="DigitBus logo" />
<h1 class="titulo">Renovación de Tarjeta</h1>
 
    <div class="seleccion-box">
<h2>Selecciona el tipo de renovación</h2>
<button @click="abrirModal('tercera')">Tercera Edad</button>
<button @click="abrirModal('estudiante')">Estudiante</button>
<button @click="abrirModal('discapacidad')">Discapacidad</button>
</div>
 
    <div v-if="tipoSeleccionado" class="modal">
<div class="modal-content">
<button class="cerrar" @click="cerrarModal">&times;</button>
<h3>Documentación para {{ etiquetas[tipoSeleccionado].titulo }}</h3>
 
        <div v-for="(campo, index) in camposPorTipo[tipoSeleccionado]" :key="index">
<label :for="campo.id">{{ campo.label }}:</label>
<input type="file" :id="campo.id" />
</div>
 
        <button class="enviar">Enviar Documentos</button>
</div>
</div>
</div>
</template>
 
<script setup>

import { ref } from 'vue'
 
const tipoSeleccionado = ref('')
 
const abrirModal = (tipo) => {

  tipoSeleccionado.value = tipo

}

const cerrarModal = () => {

  tipoSeleccionado.value = ''

}
 
const etiquetas = {

  tercera: { titulo: 'Personas de la Tercera Edad' },

  estudiante: { titulo: 'Estudiantes' },

  discapacidad: { titulo: 'Personas con Discapacidad' }

}
 
const camposPorTipo = {

  tercera: [

    { label: 'Identificación oficial', id: 'ine-tercera' },

    { label: 'Constancia de movilidad', id: 'movilidad-tercera' }

  ],

  estudiante: [

    { label: 'Constancia de estudios', id: 'constancia-estudiante' }

  ],

  discapacidad: [

    { label: 'Credencial del DIF', id: 'dif-discapacidad' },

    { label: 'Identificación oficial', id: 'ine-discapacidad' }

  ]

}
</script>
 
<style scoped>

.renovacion {

  background: #273044;

  min-height: 100vh;

  padding: 2rem;

  text-align: center;

  font-family: 'Vertiga', sans-serif;

  color: white;

}

.logo {

  width: 160px;

  margin-bottom: 1rem;

}

.titulo {

  font-size: 2rem;

  font-weight: bold;

  margin-bottom: 2rem;

}
 
.seleccion-box {

  background: white;

  color: black;

  padding: 2rem;

  border-radius: 12px;

  max-width: 600px;

  margin: auto;

  box-shadow: 0 5px 10px rgba(0,0,0,0.2);

}

.seleccion-box h2 {

  margin-bottom: 1rem;

}

.seleccion-box button {

  display: block;

  width: 100%;

  padding: 0.8rem;

  margin: 0.5rem 0;

  font-weight: bold;

  background: #1a6dff;

  color: white;

  border: none;

  border-radius: 8px;

  cursor: pointer;

}
 
.modal {

  position: fixed;

  top: 0; left: 0;

  width: 100%; height: 100%;

  background: rgba(0,0,0,0.6);

  display: flex;

  align-items: center;

  justify-content: center;

}

.modal-content {

  background: white;

  color: black;

  padding: 2rem;

  border-radius: 12px;

  width: 90%;

  max-width: 500px;

  position: relative;

  box-shadow: 0 5px 15px rgba(0,0,0,0.3);

}

.cerrar {

  position: absolute;

  top: 1rem;

  right: 1rem;

  font-size: 1.5rem;

  background: none;

  border: none;

  cursor: pointer;

}

.modal-content label {

  display: block;

  margin-top: 1rem;

  font-weight: bold;

  color: #1a6dff;

}

.modal-content input[type="file"] {

  width: 100%;

  padding: 0.5rem;

  background: #322f2f;

  color: white;

  border: none;

  border-radius: 6px;

  margin-bottom: 1rem;

}

.enviar {

  background-color: #1fa968;

  color: white;

  padding: 0.8rem 1rem;

  border: none;

  border-radius: 8px;

  font-weight: bold;

  margin-top: 1rem;

  cursor: pointer;

  width: 100%;

}
</style>

 