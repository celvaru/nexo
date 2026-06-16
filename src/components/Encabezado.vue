<template>
  <nav class="navbar navbar-expand-lg" style="background-color: mediumorchid;">
    <div class="container-fluid">
      <router-link class="navbar-brand text-white" :to="logoLink">
        <!-- <img :src="logoUrl" alt="Logo" height="35" class="me-2"> -->
        Nexo Inmobiliario
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavegacion">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div v-if="!ocultarMenu" class="collapse navbar-collapse" id="menuNavegacion">
        <ul class="navbar-nav ms-auto">
          <template v-if="usuario">
            <!-- Menú para admin -->
            <template v-if="usuario.tipo === 'admin'">
              <li class="nav-item">
                <router-link class="nav-link text-white" to="/admin">
                  Reportes
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-white" to="/admin/pagos">
                  Pagos
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-white" to="/admin/perfil">
                  Perfil
                </router-link>
              </li>
            </template>
            
            <!-- Menú para usuarios normales -->
            <template v-else>
              <li class="nav-item">
                <router-link class="nav-link text-white" to="/mis-propiedades">
                  Mis propiedades
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-white" to="/favoritos">
                  Favoritos
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-white" to="/perfil">
                  Perfil
                </router-link>
              </li>
            </template>
            
            <!-- Cerrar sesión para todos -->
            <li class="nav-item">
              <a class="nav-link text-white" href="#" @click.prevent="cerrarSesion">
                Cerrar sesión
              </a>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/registro">
                Crear cuenta
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/login">
                Iniciar sesión
              </router-link>
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
  computed: {
    logoLink() {
      if (this.usuario && this.usuario.tipo === 'admin') {
        return '/admin'
      }
      return '/'
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
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.nav-link {
  transition: none;
  padding: 0.5rem 1rem;
  border-radius: 0;
}

.nav-link:hover {
  background-color: #8b008b;
  color: white;
}

.navbar-brand {
  transition: none;
  display: flex;
  align-items: center;
}

.navbar-toggler {
  border-color: rgba(255,255,255,0.5);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}
</style>