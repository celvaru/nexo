<template>
  <div class="card h-100 shadow-sm">
    <div class="position-relative">
      <img 
        :src="propiedad.imagenPrincipal || 'https://via.placeholder.com/300x200?text=Sin+imagen'" 
        class="card-img-top" 
        style="height: 200px; object-fit: cover;"
      >
      <span v-if="propiedad.destacada" class="position-absolute top-0 end-0 m-2" style="font-size: 24px;">⭐</span>
    </div>
    
    <div class="card-body">
      <h5 class="card-title">{{ propiedad.titulo }}</h5>
      <p class="text-muted small">📍 {{ propiedad.ubicacion }}, {{ propiedad.ciudad }}</p>
      <p class="mb-1"><strong>Superficie:</strong> {{ propiedad.superficie || 0 }} m²</p>
      <p class="mb-1"><strong>Precio:</strong> ${{ formatearPrecio(propiedad.precio) }}</p>
      
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="d-flex align-items-center gap-2">
          <small class="text-muted">
            <font-awesome-icon icon="eye" /> {{ propiedad.visitas || 0 }}
          </small>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-warning" @click="abrirModalReporte" title="Reportar">
            <font-awesome-icon icon="flag" />
          </button>
          <button 
            class="btn btn-sm" 
            :class="esFavorito ? 'btn-danger' : 'btn-outline-danger'"
            @click="toggleFavorito"
            :disabled="cargandoFavorito"
          >
            <font-awesome-icon :icon="esFavorito ? 'heart' : ['far', 'heart']" />
          </button>
        </div>
      </div>
    </div>
    
    <div class="card-footer bg-transparent border-top-0 pb-3">
      <button class="btn btn-primary w-100" @click="verDetalle">
        Ver propiedad
      </button>
    </div>

    <!-- Modal de Reporte -->
    <ModalReporte 
      :mostrar="mostrarModal" 
      :propiedadId="propiedad.id"
      @cerrar="mostrarModal = false"
    />
  </div>
</template>

<script>
import ModalReporte from './ModalReporte.vue'

export default {
  name: 'TarjetaPropiedad',
  components: { ModalReporte },
  props: {
    propiedad: Object,
    esFavorito: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mostrarModal: false,
      cargandoFavorito: false
    }
  },
  methods: {
    formatearPrecio(precio) {
      return new Intl.NumberFormat('es-BO').format(precio)
    },
    abrirModalReporte() {
      const usuario = localStorage.getItem('usuario')
      if (!usuario) {
        alert('Debes iniciar sesión para reportar')
        this.$router.push('/login')
        return
      }
      this.mostrarModal = true
    },
    async toggleFavorito() {
      const usuario = localStorage.getItem('usuario')
      if (!usuario) {
        alert('Debes iniciar sesión para guardar favoritos')
        this.$router.push('/login')
        return
      }
      
      this.cargandoFavorito = true
      
      try {
        const usuarioId = JSON.parse(usuario).id
        const url = 'http://localhost:3000/api/favoritos'
        
        if (this.esFavorito) {
          const res = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuarioId, propiedadId: this.propiedad.id })
          })
          
          if (res.ok) {
            this.$emit('toggle-favorito', this.propiedad.id)
          }
        } else {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuarioId, propiedadId: this.propiedad.id })
          })
          
          if (res.ok) {
            this.$emit('toggle-favorito', this.propiedad.id)
          }
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al guardar favorito')
      } finally {
        this.cargandoFavorito = false
      }
    },
    verDetalle() {
      this.$router.push(`/propiedad/${this.propiedad.id}`)
    },

    async verDetalle() {
      try {
        // Registrar visita
        const usuario = localStorage.getItem('usuario')
        const visitanteId = usuario ? JSON.parse(usuario).id : null
        
        await fetch(`http://localhost:3000/api/propiedades/${this.propiedad.id}/visita`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitanteId })
        })
      } catch (error) {
        console.error('Error registrando visita:', error)
      }
      
      this.$router.push(`/propiedad/${this.propiedad.id}`)
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  overflow: hidden;
}

.btn-primary {
  background-color: mediumorchid;
  border-color: mediumorchid;
}
.btn-primary:hover {
  background-color: #8b008b;
  border-color: #8b008b;
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  border-color: #ffc107;
}
.btn-outline-warning:hover .fa-flag {
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}
.btn-outline-danger:hover .fa-heart {
  color: white;
}
</style>