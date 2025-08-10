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
import Solicitudes from '../views/Solicitudes.vue'
import Renovaciones from '../views/Renovaciones.vue'
import PagoSucursal from '../views/PagoSucursal.vue'
import Conocenos from '../views/Conocenos.vue'
import PaymentMenu from '../views/PaymentMenu.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import ConocenosInisio from '../views/ConocenosInisio.vue'



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
  {path: '/Solicitudes', component: Solicitudes},
  {path: '/Renovaciones', component: Renovaciones},
  {path: '/Conocenos', component: Conocenos},
  {path: '/PaymentMenu', component: PaymentMenu},
  {path: '/PaymentSuccess', component: PaymentSuccess},
  {path: '/ConocenosInisio', component: ConocenosInisio }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
