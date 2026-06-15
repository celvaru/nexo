<template>
  <div class="card h-100 shadow-sm">
    <div class="position-relative">
      <img 
        :src="propiedad.imagenPrincipal || 'https://via.placeholder.com/300x200?text=Sin+imagen'" 
        class="card-img-top" 
        alt="Propiedad"
        style="height: 200px; object-fit: cover;"
      >
      <span v-if="propiedad.destacada" class="badge bg-warning position-absolute top-0 end-0 m-2">
        ⭐ Destacada
      </span>
    </div>
    
    <div class="card-body">
      <h5 class="card-title">{{ propiedad.titulo }}</h5>
      <p class="card-text text-muted small">📍 {{ propiedad.ubicacion }}</p>
      
      <!-- Información simplificada: solo superficie y precio -->
      <div class="info-propiedad">
        <p class="mb-1"><strong>Superficie:</strong> {{ propiedad.superficie || 0 }} m²</p>
        <p class="mb-1"><strong>Precio:</strong> ${{ formatearPrecio(propiedad.precio) }}</p>
      </div>
      
      <div class="d-flex justify-content-between align-items-center mt-3">
        <small class="text-muted">
            <font-awesome-icon icon="eye" />
            {{ propiedad.visitas || 0 }} visitas</small>
        <div class="botones-accion">
          <button class="btn btn-sm btn-outline-warning" @click="reportarPropiedad" title="Reportar propiedad">
            <font-awesome-icon icon="flag" />
          </button>
          <button 
            class="btn btn-sm" 
            :class="esFavorito ? 'btn-danger' : 'btn-outline-danger'"
            @click="toggleFavorito" 
            title="Favorito"
          >
            <font-awesome-icon :icon="esFavorito ? 'heart' : ['far', 'heart']" />
          </button>
        </div>
      </div>
    </div>
    
    <div class="card-footer bg-transparent border-top-0 pb-3">
      <button class="btn w-100" :class="esFavorito ? 'btn-secondary' : 'btn-primary'" @click="verDetalle">
        Ver propiedad
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TarjetaPropiedad',
  props: {
    propiedad: {
      type: Object,
      required: true
    },
    esFavorito: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatearPrecio(precio) {
      return new Intl.NumberFormat('es-BO').format(precio)
    },
    toggleFavorito() {
      this.$emit('toggle-favorito', this.propiedad.id)
    },
    reportarPropiedad() {
      this.$emit('reportar-propiedad', this.propiedad.id)
    },
    verDetalle() {
      this.$router.push(`/propiedad/${this.propiedad.id}`)
    }
  }
}
</script>

<style scoped>
.card {
  transition: none;
  border-radius: 8px;
  overflow: hidden;
}

.info-propiedad {
  font-size: 0.95rem;
}

.botones-accion {
  display: flex;
  gap: 8px;
}

/* Solo ajustes mínimos para mantener consistencia */
.btn-primary {
  background-color: mediumorchid;
  border-color: mediumorchid;
}

.btn-primary:hover {
  background-color: mediumpurple;
  border-color: mediumpurple;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover .fa-heart {
  color: white;
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-outline-warning:hover .fa-flag {
  color: white;
}
</style>