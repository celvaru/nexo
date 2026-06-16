import { createRouter, createWebHistory } from 'vue-router'
import InicioVista from '../views/InicioVista.vue'
import MapaVista from '../views/MapaVista.vue'
import LoginVista from '../views/LoginVista.vue'
import RegistroVista from '../views/RegistroVista.vue'
import Dashboard from '../views/Dashboard.vue'
import { getUsuario, isAdmin, isAuthenticated } from '../stores/autenticar.js'
import Documentos from '../views/Documentos.vue'


const routes = [
  { path: '/', name: 'Inicio', component: InicioVista },
  { path: '/mapa', name: 'Mapa', component: MapaVista },
  { path: '/login', name: 'Login', component: LoginVista },
  { path: '/registro', name: 'Registro', component: RegistroVista },
  { path: '/admin', name: 'Admin', component: Dashboard, meta: { requiresAdmin: true }},
  { path: '/admin/documentos', name: 'Documentos', component: Documentos, meta: { requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const usuario = getUsuario()
  

  if (to.meta.requiresAdmin) {
    if (usuario && usuario.tipo === 'admin') {
      next()
    } else {
      next('/')
    }
  } 

  else if ((to.path === '/login' || to.path === '/registro') && usuario) {
    next('/')
  }
  else {
    next()
  }
})

export default router