import { createRouter, createWebHistory } from 'vue-router'
import InicioVista from '../views/InicioVista.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: InicioVista
  },
  {
    path: '/propiedades',
    name: 'propiedades',
    component: () => import('../views/PropiedadesVista.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginVista.vue')
  },
  {
    path: '/registro',
    name: 'registro',
    component: () => import('../views/RegistroVista.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router