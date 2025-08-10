<template>
<div class="conocenos-bg">
<header class="top-nav">
<img src="@/assets/img/logo_digitbus_color.svg" class="logo" alt="DigitBus logo" />
<nav>
        <router-link to="/">Inicio sesion</router-link>
</nav>
</header>
 
    <main class="conocenos-contenido">
<section class="intro">
<h1>Conócenos</h1>
<p>
<strong>DigitBus</strong> es una startup que nació para revolucionar la movilidad y el acceso al transporte público en nuestra ciudad, creando una experiencia de usuario más segura, eficiente y humana.
</p>
</section>
 
      <section class="bloques">
<div class="bloque">
<h2 class="azul">Visión</h2>
<p>
            Ser el sistema digital de transporte público más confiable y accesible de México, inspirando ciudades más conectadas, ágiles e incluyentes.
</p>
</div>
<div class="bloque">
<h2 class="verde">Propósito</h2>
<p>
            Mejorar la vida de millones de usuarios del transporte público, ofreciéndoles recargas digitales, información útil y beneficios exclusivos desde una sola plataforma.
</p>
</div>
<div class="bloque">
<h2 class="azul-marino">Misión</h2>
<p>
            Brindar soluciones tecnológicas sencillas, seguras y transparentes para que todos puedan moverse con confianza, pagando y consultando su saldo de forma inmediata, sin filas ni complicaciones.
</p>
</div>
<div class="bloque futuro">
<h2>¿Hacia dónde vamos?</h2>
<p>
            Pronto llevaremos DigitBus a otras ciudades y rutas, integrando nuevos métodos de pago, descuentos, credenciales digitales y herramientas inteligentes para que tu experiencia de transporte sea aún más cómoda y eficiente.
</p>
</div>
</section>
</main>
</div>
</template>
 
<script setup>
// Aquí podrías cargar dinámicamente equipo, valores, o testimonios si lo requieres en el futuro.
</script>
 
<style scoped>
:root {
  --azul: #1a6dff;
  --verde: #51c638;
  --azul-marino: #2a3547;
  --blanco: #ffffff;
}
.conocenos-bg {
  min-height: 100vh;
  background: #f7f9fc;
  font-family: 'Vertiga', sans-serif;
}
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--blanco);
  padding: 1rem 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.logo {
  height: 36px;
}
.top-nav nav a {
  margin-left: 1.3rem;
  color: var(--azul-marino);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.18s;
}
.top-nav nav a.activo,
.top-nav nav a:hover {
  color: var(--azul);
  font-weight: 700;
}
.conocenos-contenido {
  max-width: 900px;
  margin: 3.5rem auto 2rem auto;
  padding: 1.3rem;
}
.intro {
  text-align: center;
  margin-bottom: 2.5rem;
}
.intro h1 {
  font-size: 2.3rem;
  color: var(--azul-marino);
  margin-bottom: 0.7rem;
  font-weight: 800;
}
.intro p {
  font-size: 1.1rem;
  color: #444;
  line-height: 1.6;
}
 
.bloques {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
}
@media (max-width: 750px) {
  .bloques {
    grid-template-columns: 1fr;
  }
}
.bloque {
  background: var(--blanco);
  border-radius: 13px;
  box-shadow: 0 2.5px 13px rgba(26, 109, 255, 0.04);
  padding: 2rem 1.3rem;
  border-left: 8px solid var(--azul);
  transition: box-shadow 0.2s;
}
.bloque:hover {
  box-shadow: 0 7px 32px rgba(26,109,255,0.13);
}
.bloque h2 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
}
.bloque p {
  color: #353535;
  line-height: 1.7;
}
.azul { color: var(--azul);}
.verde { color: var(--verde);}
.azul-marino { color: var(--azul-marino);}
.bloque.verde { border-left-color: var(--verde);}
.bloque.azul-marino { border-left-color: var(--azul-marino);}
.futuro { border-left-color: #ffd500;}
.futuro h2 { color: #ffd500;}
</style>