<template>
  <div class="mapa-container">
    <!-- Barra de búsqueda avanzada -->
    <BarraLateral @buscar="aplicarFiltros" />
    
    <div class="container-fluid mt-3">
      <div class="row">
        <div class="col-12">
          <!-- Aquí irá el mapa -->
          <div class="mapa-placeholder">
            <div class="alert alert-info text-center">
              <h5>🗺️ Vista de Mapa</h5>
              <p>Próximamente: Visualización interactiva de propiedades con Leaflet</p>
              <p class="small">Los filtros se aplicarán automáticamente cuando el mapa esté listo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraLateral from '@/components/BarraLateral.vue'

export default {
  name: 'MapaVista',
  components: {
    BarraLateral
  },
  data() {
    return {
      filtrosActivos: {}
    }
  },
  methods: {
    aplicarFiltros(filtros) {
      this.filtrosActivos = filtros
      console.log('Filtros aplicados:', filtros)
      // Aquí luego actualizarás el mapa cuando esté implementado
    }
  }
}
</script>

<style scoped>
.mapa-container {
  background-color: lavender;
  min-height: 100vh;
}

.mapa-placeholder {
  background: white;
  border-radius: 8px;
  padding: 40px;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>