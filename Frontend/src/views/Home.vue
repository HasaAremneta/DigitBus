<template>
  <div class="inicio-container">
    <!-- Header -->
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav class="nav-links">
        <router-link to="/Conocenos">Conócenos</router-link>
        <!--Boton de salida de sesion-->
        <a href="#" @click.prevent="confirmarSalida">Salir</a>
        <!-- <router-link to="/login">Salir</router-link> -->
      </nav>
    </header>

    <!-- Banner principal -->
    <section class="banner">
      <div class="banner-text">
        <h2>Ya ha llegado<br />el mejor método<br />de pago a León</h2>
      </div>
      <div class="banner-video">
        <img src="https://via.placeholder.com/300x200?text=Video" alt="¿Qué es DigitBus?" class="video-thumb" />
        <button class="play-button">▶</button>
      </div>
    </section>

    <!-- Accesos rápidos -->
    <section class="features">
      <div
        class="feature-card"
        v-for="item in accesos"
        :key="item.titulo"
        @click="irARuta(item.ruta)"
      >
        <img :src="item.img" :alt="item.titulo" class="feature-img" />
        <h3>{{ item.titulo }}</h3>
        <p>{{ item.descripcion }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

//Función para redirigir a la página de inicio
const irARuta = (ruta) => {
  router.push(ruta);
};

// Datos de los accesos rápidos
const accesos = [
  {
    titulo: 'Historial de pagos',
    descripcion: 'Consulta tu historial de pagos y transacciones.',
    img: 'https://via.placeholder.com/150?text=Historial+Pagos',
    ruta: '/historial'
  },
  {
    titulo: 'recargas',
    descripcion: 'Recarga tu saldo de forma fácil y rápida.',
    img: 'https://via.placeholder.com/150?text=Recargas',
    ruta: '/pago-sucursal'
  },
  {
    titulo: 'solicitudes',
    descripcion: 'Realiza solicitudes y gestiona tus servicios.(Mantenimieneto)',
    img: 'https://via.placeholder.com/150?text=Solicitudes',
    ruta: '/Solicitudes'
  },
  {
    titulo: 'Renovaciones',
    descripcion: 'Renueva tu servicio de forma sencilla.()',
    img: 'https://via.placeholder.com/150?text=Renovaciones',
    ruta: '/Renovaciones'
  }
]

const confirmarSalida = () => {
  if (confirm('¿Estás seguro de que quieres salir?')) {
    // Aquí puedes agregar la lógica para cerrar sesión
    router.push('/'); // Redirige a la página de login
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

/* Banner */
.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background-color: #111;
  color: white;
  flex-wrap: wrap;
}

.banner-text h2 {
  font-size: 2rem;
  line-height: 1.5;
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
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 2rem;
}

.feature-card {
  background-color: #001f3f;
  color: white;
  border-radius: 12px;
  width: 200px;
  margin: 1rem;
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: scale(1.05);
}

.feature-img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}
</style>
