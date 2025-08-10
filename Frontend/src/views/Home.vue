<template>
  <div class="inicio-container">
    <!-- Header -->
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav class="nav-links">
        <router-link to="/Conocenos"><button class="btn-menu">Conócenos</button></router-link>
        <!--Boton de salida de sesion-->
        <a href="#" @click.prevent="showUserList"><button class="btn-menu">{{ currentUser }} <i class="pi pi-user"
              style="font-size: large; margin-left: 5px;"></i></button></a>
        <!-- <router-link to="/login">Salir</router-link> -->
      </nav>
    </header>
    <ul class="user-list" id="userList">
      <li @click="irARuta('/Ajustes')" @mouseover="ajustesHover = true" @mouseleave="ajustesHover = false">
        <i :class="ajustesHover ? 'pi pi-spin pi-cog' : 'pi pi-cog'"></i> Ajustes </li>
      <li @click.prevent="confirmarSalida" class="option-menu"><i class="pi pi-arrow-left"></i> Cerrar Sesion</li>
    </ul>

    <!-- Banner principal -->
    <section class="banner">
      <div class="banner-text">
        <h2>Ya ha llegado!!</h2>
        <h2 style="text-align: center;">el mejor método</h2>
        <h2 style="float: right;">de pago a León</h2>
      </div>
      <!-- <div class="banner-video">
        <img src="https://via.placeholder.com/300x200?text=Video" alt="¿Qué es DigitBus?" class="video-thumb" />
        <button class="play-button">▶</button>
      </div> -->
    </section>

    <!-- Accesos rápidos -->
    <section class="features">
      <div class="feature-card" v-for="item in accesos" :key="item.titulo" @click="irARuta(item.ruta)">
        <!-- <img :src="item.img" :alt="item.titulo" class="feature-img" /> -->
        <i :class="item.icon" style="font-size: 2.5rem; padding: 15px;"></i>
        <h3>{{ item.titulo }}</h3>
        <p>{{ item.descripcion }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>

import 'primeicons/primeicons.css'
import { ref } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

var lstVisible = ref(false);
const ajustesHover = ref(false);
const currentUser = ref(localStorage.getItem("username"));
//Función para redirigir a la página de inicio
const irARuta = (ruta) => {
  router.push(ruta);
};

// Datos de los accesos rápidos
const accesos = [
  {
    titulo: 'Historial de pagos',
    descripcion: 'Consulta tu historial de pagos y transacciones.',
    icon: 'pi pi-history',
    ruta: '/historial'
  },
  {
    titulo: 'recargas',
    descripcion: 'Recarga tu saldo de forma fácil y rápida.',
    icon: 'pi pi-credit-card',
    ruta: '/pago-sucursal'
  },
  {
    titulo: 'solicitudes',
    descripcion: 'Realiza solicitudes y gestiona tus servicios.(Mantenimieneto)',
    icon: 'pi pi-file-plus',
    ruta: '/Solicitudes'
  },
  {
    titulo: 'Renovaciones',
    descripcion: 'Renueva tu servicio de forma sencilla.()',
    icon: 'pi pi-file-arrow-up',
    ruta: '/Renovaciones'
  }
]

const confirmarSalida = () => {
  if (confirm('¿Estás seguro de que quieres salir?')) {
    router.push('/');
  }
}

const showUserList = () => {
  var usrlst = document.getElementById("userList");

  if (lstVisible.value === false) {
    usrlst.style.display = 'block';
    lstVisible.value = true;
  }
  else {
    usrlst.style.display = 'none';
    lstVisible.value = false;
  }

}
</script>

<style scoped>
.inicio-container {
  font-family: 'Arial', sans-serif;
}

/* Header */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logo {
  height: 40px;
}

.nav-links a {
  margin-left: 20px;
  text-decoration: none;
  color: #2b63f3;
  font-weight: bold;
}

.btn-menu {
  background-color: #ffffff;
  color: #2b63f3;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  text-decoration: none;
  transition: 0.5s;
}


.btn-menu:hover {
  background-color: #2b63f3;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  text-decoration: none;
  transition: 0.5s;
}


/* Banner */
.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background-color: #111;
  color: white;
  flex-wrap: wrap;
  background-image: url('../src/img/fondo1.jpg');
  background-repeat: no-repeat;
  background-size: auto;
  backdrop-filter: blur(2px);
}

.banner-text h2 {
  font-size: 2.4rem;
  line-height: 1;
  text-shadow: black 3px 3px 5px;

}

.banner-text {
  width: 100%;
  backdrop-filter: blur(3px);
}

.banner-video {
  position: relative;
}

.video-thumb {
  width: 300px;
  border-radius: 12px;
}

.play-button {
  position: absolute;
  top: 40%;
  left: 45%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
}

/* Features */
.features {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.feature-card {
  background-color: #001f3f;
  color: white;
  border-radius: 12px;
  width: 23%;
  padding: 1rem;
  text-align: center;
  transition: 0.5s;
}

.feature-card:hover {
  transform: scale(1.1);
  cursor: pointer;
  transition: 0.5s;
  background-color: #023f7b;
}

.feature-img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}

.user-list {
  background-color: #4e80b100;
  color: white;
  width: 10%;
  justify-self: end;
  position: absolute;
  z-index: 99;
  margin-right: 15px;
  display: none;
}

.user-list li {
  background-color: #023f7b;
  color: white;
  list-style: none;
  padding: 5px;
  width: 100%;
}

.user-list li:hover {
  background-color: white;
  color: #023f7b;
  cursor: pointer;
}

@keyframes salir {
  0%   { transform: translateX(-3px); }
  50%  { transform: translateX(3px); }
  100% { transform: translateX(-3px); }
}


.option-menu:hover i {
  animation: salir 1s ease-in-out infinite;
}
</style>
