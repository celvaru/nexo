<template>
  <nav class="navbar navbar-expand-lg" style="background-color: mediumorchid;">
    <div class="container-fluid">
      <router-link class="navbar-brand text-white" to="/">🏠 Nexo Inmobiliario</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavegacion">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Mostrar el menú SOLO si NO está en login o registro -->
      <div v-if="!ocultarMenu" class="collapse navbar-collapse" id="menuNavegacion">
        <ul class="navbar-nav ms-auto">
          <template v-if="usuario">
            <li class="nav-item">
              <span class="nav-link text-white">Hola, {{ usuario.usuario }}</span>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/mis-propiedades">Mis propiedades</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/favoritos">Favoritos</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="#" @click.prevent="cerrarSesion">Cerrar sesión</a>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/registro">Crear cuenta</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/login">Iniciar sesión</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      usuario: null,
      ocultarMenu: false
    }
  },
  mounted() {
    this.verificarSesion()
    this.verificarRuta()
    window.addEventListener('storage', this.verificarSesion)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.verificarSesion)
  },
  watch: {
    // Observar cambios en la ruta
    '$route.path'() {
      this.verificarRuta()
    }
  },
  methods: {
    verificarSesion() {
      const usuarioGuardado = localStorage.getItem('usuario')
      this.usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null
    },
    verificarRuta() {
      // Ocultar menú en las rutas de login y registro
      const rutaActual = this.$route.path
      this.ocultarMenu = rutaActual === '/login' || rutaActual === '/registro'
    },
    cerrarSesion() {
      localStorage.removeItem('usuario')
      this.usuario = null
      this.$router.push('/')
    }
  }
}
</script>