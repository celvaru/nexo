<template>
  <div class="documentos-container">
    <div class="contenido-principal">
      <div class="container-fluid">
        <h2 class="mb-4">Generar Reportes</h2>
        
        <!-- Selector de tipo de reporte -->
        <div class="row mb-4">
          <div class="col-md-4">
            <label class="form-label fw-bold">Tipo de reporte</label>
            <select class="form-select" v-model="tipoReporte" @change="cambiarTipo">
              <option value="">Seleccionar tipo...</option>
              <option value="usuarios">Usuarios</option>
              <option value="propiedades">Propiedades</option>
              <option value="ingresos">Ingresos Premium</option>
            </select>
          </div>
        </div>

        <!-- Componentes de reporte según tipo -->
        <div v-if="tipoReporte === 'usuarios'">
          <ReporteUsuarios ref="reporteUsuarios" />
        </div>
        
        <div v-else-if="tipoReporte === 'propiedades'">
          <ReportePropiedades ref="reportePropiedades" />
        </div>
        
        <div v-else-if="tipoReporte === 'ingresos'">
          <ReporteIngresos ref="reporteIngresos" />
        </div>
        
        <div v-else class="text-center py-5">
          <p class="lead text-muted">Selecciona un tipo de reporte para comenzar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReporteUsuarios from '@/components/ReporteUsuarios.vue'
import ReportePropiedades from '@/components/ReportePropiedades.vue'
import ReporteIngresos from '@/components/ReporteIngresos.vue'

export default {
  name: 'Documentos',
  components: {
    ReporteUsuarios,
    ReportePropiedades,
    ReporteIngresos
  },
  data() {
    return {
      tipoReporte: ''
    }
  },
  methods: {
    cambiarTipo() {
      // Resetear componentes al cambiar
      this.$nextTick(() => {
        if (this.tipoReporte === 'usuarios' && this.$refs.reporteUsuarios) {
          this.$refs.reporteUsuarios.cargarDatos()
        } else if (this.tipoReporte === 'propiedades' && this.$refs.reportePropiedades) {
          this.$refs.reportePropiedades.cargarDatos()
        } else if (this.tipoReporte === 'ingresos' && this.$refs.reporteIngresos) {
          this.$refs.reporteIngresos.cargarDatos()
        }
      })
    }
  }
}
</script>

<style scoped>
.documentos-container {
  background-color: lavender;
  min-height: 100vh;
}

.contenido-principal {
  padding: 20px;
}

.form-select {
  background-color: white;
  border: 1px solid #ddd;
}

.form-select:focus {
  border-color: mediumorchid;
  box-shadow: 0 0 0 0.2rem rgba(186, 85, 211, 0.25);
}
</style>