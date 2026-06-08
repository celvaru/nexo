<template>
  <div class="registro-contenedor">
    <div class="card shadow" style="width: 100%; max-width: 450px;">
      <div class="card-header text-white text-center" style="background-color: mediumorchid;">
        <h4>📝 Crear Cuenta</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="registrar">
          <!-- Correo -->
          <input 
            type="email" 
            class="form-control mb-2" 
            v-model="correo" 
            placeholder="Correo electrónico" 
            required
          >
          
          <!-- Usuario -->
          <input 
            type="text" 
            class="form-control mb-2" 
            v-model="usuario" 
            placeholder="Nombre de usuario" 
            required
          >
          
          <!-- Contraseña -->
          <input 
            type="password" 
            class="form-control mb-2" 
            v-model="password" 
            placeholder="Contraseña (mínimo 8 caracteres)" 
            required
            @input="validarPassword"
          >
          <div v-if="passwordError" class="text-danger small mb-2">{{ passwordError }}</div>
          <div v-if="passwordValida" class="text-success small mb-2">✓ Contraseña válida</div>
          
          <!-- Confirmar contraseña -->
          <input 
            type="password" 
            class="form-control mb-3" 
            v-model="confirmarPassword" 
            placeholder="Confirmar contraseña" 
            required
            @input="validarConfirmacion"
          >
          <div v-if="confirmacionError" class="text-danger small mb-2">{{ confirmacionError }}</div>
          <div v-if="confirmacionValida" class="text-success small mb-2">✓ Las contraseñas coinciden</div>
          
          <button 
            class="btn w-100 text-white" 
            style="background-color: mediumorchid;" 
            :disabled="cargando || !formularioValido"
          >
            {{ cargando ? 'Registrando...' : 'Registrarse' }}
          </button>
          
          <div v-if="mensaje" class="alert mt-3" :class="mensajeError ? 'alert-danger' : 'alert-success'">
            {{ mensaje }}
          </div>
        </form>
        
        <hr>
        <div class="text-center">
          <router-link to="/login">¿Ya tienes cuenta? Inicia sesión</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistroVista',
  data() {
    return {
      correo: '',
      usuario: '',
      password: '',
      confirmarPassword: '',
      cargando: false,
      mensaje: '',
      mensajeError: false,
      passwordError: '',
      confirmacionError: ''
    }
  },
  computed: {
    passwordValida() {
      return this.password.length >= 8 && !this.passwordError
    },
    confirmacionValida() {
      return this.confirmarPassword.length > 0 && this.password === this.confirmarPassword && !this.confirmacionError
    },
    formularioValido() {
      return this.correo && this.usuario && this.passwordValida && this.confirmacionValida
    }
  },
  methods: {
    validarPassword() {
      if (this.password.length === 0) {
        this.passwordError = ''
      } else if (this.password.length < 8) {
        this.passwordError = 'La contraseña debe tener al menos 8 caracteres'
      } else {
        this.passwordError = ''
      }
      this.validarConfirmacion()
    },
    validarConfirmacion() {
      if (this.confirmarPassword.length === 0) {
        this.confirmacionError = ''
      } else if (this.password !== this.confirmarPassword) {
        this.confirmacionError = 'Las contraseñas no coinciden'
      } else {
        this.confirmacionError = ''
      }
    },
    async registrar() {
      this.cargando = true
      this.mensaje = ''
      this.mensajeError = false
      
      try {
        const res = await fetch('http://localhost:3000/api/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: '',
            apPaterno: '',
            apMaterno: '',
            correo: this.correo,
            usuario: this.usuario,
            password: this.password,
            celular: null
          })
        })
        
        const data = await res.json()
        
        if (res.ok) {
          this.mensaje = '¡Registro exitoso! Redirigiendo al login...'
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          this.mensaje = data.error || 'Error al registrar'
          this.mensajeError = true
        }
      } catch (error) {
        this.mensaje = 'Error de conexión con el servidor'
        this.mensajeError = true
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>

<style scoped>
.registro-contenedor {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px);
  padding: 1rem;
}
</style>