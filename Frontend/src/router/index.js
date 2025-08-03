import { createRouter, createWebHistory } from 'vue-router'

// Importa tus vistas
import Home from '../views/Home.vue'
import InicioSesion from '../views/InicioSesion.vue'
import Historial from '../views/Historial.vue'
import Ajustes from '../views/Ajustes.vue'
import AgregarTarjeta from '../views/AgregarTarjeta.vue'
import AjustesPerfil from '../views/AjustesPerfil.vue'
import Registro from '../views/Registro.vue'
import Recuperacion from '../views/Recuperacion.vue'

import PagoSucursal from '../views/PagoSucursal.vue';



const routes = [
  { path: '/home', component: Home },
  { path: '/', component: InicioSesion },
  { path: '/historial', component: Historial },
  { path: '/ajustes', component: Ajustes },
  { path: '/agregar-tarjeta', component: AgregarTarjeta },
  { path: '/ajustes-perfil', component: AjustesPerfil },
  { path: '/pago-sucursal', component: PagoSucursal },
  {path: '/registro', component: Registro },
  {path: '/recuperacion', component: Recuperacion },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
