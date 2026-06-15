import { createRouter, createWebHistory } from 'vue-router'
import InicioVista from '../views/InicioVista.vue'
import MapaVista from '../views/MapaVista.vue'
import LoginVista from '../views/LoginVista.vue'
import RegistroVista from '../views/RegistroVista.vue'

const routes = [
  { path: '/', name: 'Inicio', component: InicioVista },
  { path: '/mapa', name: 'Mapa', component: MapaVista },
  { path: '/login', name: 'Login', component: LoginVista },
  { path: '/registro', name: 'Registro', component: RegistroVista },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router