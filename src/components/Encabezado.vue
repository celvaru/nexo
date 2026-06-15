<template>
  <nav class="navbar navbar-expand-lg" style="background-color: mediumorchid;">
    <div class="container-fluid">
      <router-link class="navbar-brand text-white" to="/">🏠 Nexo Inmobiliario</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavegacion">
        <span class="navbar-toggler-icon"></span>
      </button>

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
  name: 'Encabezado',
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

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-link:hover {
  background-color: mediumpurple;
  color: white;
  transform: translateY(-2px);
}

.navbar-brand:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}


</style>