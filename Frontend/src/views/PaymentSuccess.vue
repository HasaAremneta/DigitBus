<template>
    <header class="top-nav">
      <img src="@/assets/img/logo_digitbus_color.svg" alt="DigitBus" class="logo" />
      <nav>
      </nav>
    </header>
    <img src="../img/fondoLogin.png" alt="" class="fondo">
    <div class="payment-success">
        <div class="success-icon">
            <i class="pi pi-check-circle" style="font-size: 18vh; color: green;"></i>
        </div>
        <h1>¡Pago exitoso!</h1>
        <p>Gracias por tu compra. Tu pago ha sido procesado correctamente.</p>
        
        <router-link to="/home" class="btn-back">Regresar al inicio <i class="pi pi-arrow-left" style="margin-left: 5px; font-size: small;"></i></router-link>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import axios from 'axios'

onMounted(async () => {
  const idTarjeta = localStorage.getItem("idTarjeta");
  const monto = localStorage.getItem("monto");

  if (!idTarjeta || !monto) {
    console.log('No hay datos de recarga para enviar.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/api/payment/success', {
      idTarjeta: idTarjeta,
      monto: monto
    });
    console.log('Respuesta:', response.data);

    localStorage.removeItem("idTarjeta");
    localStorage.removeItem("monto");
  } catch (error) {
    console.error('Error en la recarga:', error.response ? error.response.data : error.message);
  }
});
</script>


<style scoped>
body{
    display: flex;
}
.fondo {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
}

.payment-success {
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
    justify-content: center;
    min-height: 70vh;
    text-align: center;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.582);
    justify-self: center;
    margin-top: 30px;
    border-radius: 3%;
}
.success-icon {
    margin-bottom: 34px;
}
h1 {
    color: #4CAF50;
    margin-bottom: 12px;
}

.btn-back{
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 10px;
    text-decoration: none;
    transition: 0.3s;
}

.btn-back:hover {
    transform: scale(1.05);
    transition: 0.3s;
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
</style>