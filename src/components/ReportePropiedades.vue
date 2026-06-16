<template>
  <div class="reporte-propiedades">
    <div class="card">
      <div class="card-header" style="background-color: mediumorchid; color: white;">
        <h5 class="mb-0">Reporte de Propiedades</h5>
      </div>
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-md-3">
            <select class="form-select form-select-sm" v-model="filtros.categoria" @change="cargarDatos">
              <option value="todos">Todas las categorías</option>
              <option value="1">Casas</option>
              <option value="2">Departamentos</option>
              <option value="3">Terrenos</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select form-select-sm" v-model="filtros.ciudad" @change="cargarDatos">
              <option value="todas">Todas las ciudades</option>
              <option v-for="c in ciudades" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select form-select-sm" v-model="filtros.estado" @change="cargarDatos">
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponibles</option>
              <option value="vendida">Vendidas</option>
              <option value="reportada">Reportadas</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select form-select-sm" v-model="filtros.ordenar" @change="cargarDatos">
              <option value="precio_asc">Precio (menor)</option>
              <option value="precio_desc">Precio (mayor)</option>
              <option value="votos_desc">Más votados</option>
              <option value="categoria">Categoría</option>
            </select>
          </div>
        </div>
        <div class="row g-2 mb-3">
          <div class="col-12 text-end">
            <button class="btn btn-success btn-sm" @click="generarPDF">
              <font-awesome-icon icon="file-pdf" /> Generar PDF
            </button>
          </div>
        </div>

        <!-- Tabla -->
        <div v-if="cargando" class="text-center py-3">
          <div class="spinner-border spinner-border-sm text-primary"></div>
        </div>
        <div v-else-if="propiedades.length === 0" class="text-center py-3">
          <p class="mb-0">No se encontraron propiedades</p>
        </div>
        <div v-else>
          <table class="table table-sm table-hover" id="tabla-propiedades">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Vendedor</th>
                <th>Precio</th>
                <th>Ciudad</th>
                <th>Categoría</th>
                <th>Votos</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in propiedades" :key="prop.id">
                <td>{{ prop.id }}</td>
                <td>{{ prop.titulo }}</td>
                <td>{{ prop.vendedor || prop.usuario }}</td>
                <td>${{ prop.precio.toLocaleString() }}</td>
                <td>{{ prop.ciudad }}</td>
                <td>{{ prop.categoria === 1 ? 'Casa' : prop.categoria === 2 ? 'Depto' : 'Terreno' }}</td>
                <td>{{ prop.puntuacion || prop.votos || 0 }}</td>
                <td>
                  {{ prop.vendida ? 'Vendida' : 'Disponible' }}
                  <span v-if="prop.reportada">, Reportada</span>
                  <span v-if="prop.oculta">, Oculta</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-center">
            <small class="text-muted">Total: {{ propiedades.length }} propiedades</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pdfService from '../services/pdf.js'
import logoNegro from '@/components/icons/logo-negro.png'

export default {
  name: 'ReportePropiedades',
  data() {
    return {
      propiedades: [],
      ciudades: [],
      cargando: false,
      filtros: { categoria: 'todos', ciudad: 'todas', estado: 'todos', ordenar: 'precio_asc' }
    }
  },
  mounted() {
    this.cargarCiudades()
    this.cargarDatos()
  },
  methods: {
    async cargarCiudades() {
      try {
        const res = await fetch('http://localhost:3000/api/propiedades/ciudades')
        if (res.ok) this.ciudades = await res.json()
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async cargarDatos() {
      this.cargando = true
      try {
        let url = 'http://localhost:3000/api/propiedades/reporte?'
        const params = []
        if (this.filtros.categoria !== 'todos') params.push(`categoria=${this.filtros.categoria}`)
        if (this.filtros.ciudad !== 'todas') params.push(`ciudad=${this.filtros.ciudad}`)
        if (this.filtros.estado === 'vendida') params.push('vendida=true')
        else if (this.filtros.estado === 'reportada') params.push('reportada=true')
        else if (this.filtros.estado === 'disponible') params.push('vendida=false&reportada=false&oculta=false')
        if (this.filtros.ordenar) params.push(`orden=${this.filtros.ordenar}`)
        
        const res = await fetch(url + params.join('&'))
        if (res.ok) this.propiedades = await res.json()
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.cargando = false
      }
    },
    async generarPDF() {
        try {
            await pdfService.generarPDFTabla('tabla-propiedades', {
            titulo: 'Reporte de Propiedades',
            nombreArchivo: 'reporte_propiedades',
            logo: logoNegro,
            orientacion: 'landscape'
            })
        } catch (error) {
            console.error('Error:', error)
            alert('Error al generar el PDF')
        }
    }
  }
}
</script>

<style scoped>
.reporte-propiedades {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  background-color: mediumorchid !important;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}
.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.table-sm {
  font-size: 14px;
}
</style>