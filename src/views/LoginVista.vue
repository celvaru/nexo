<template>
  <div class="login-contenedor">
    <div class="card shadow" style="width: 100%; max-width: 450px;">
      <div class="card-header text-white text-center" style="background-color: mediumorchid;">
        <h4>Iniciar Sesión</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="login">
          <input type="text" class="form-control mb-2" v-model="correo" placeholder="Correo o usuario" required>
          <input type="password" class="form-control mb-3" v-model="password" placeholder="Contraseña" required>
          <button class="btn w-100 text-white" style="background-color: mediumorchid;" :disabled="cargando">
            {{ cargando ? 'Ingresando...' : 'Ingresar' }}
          </button>
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        </form>
        <hr>
        <div class="text-center">
          <router-link to="/registro">¿No tienes cuenta? Regístrate</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      correo: '',
      password: '',
      cargando: false,
      error: ''
    }
  },
  methods: {
    async login() {
      this.cargando = true
      this.error = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: this.correo, password: this.password })
        })
        
        const data = await res.json()
        
        if (res.ok) {
          localStorage.setItem('usuario', JSON.stringify(data.usuario))
          window.location.href = '/'
        } else {
          this.error = data.error
        }
      } catch {
        this.error = 'Error de conexión'
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>

<style scoped>
.login-contenedor {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px);
  padding: 1rem;
}
</style>