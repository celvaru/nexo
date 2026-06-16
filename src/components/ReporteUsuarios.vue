<template>
  <div class="reporte-usuarios">
    <div class="card">
      <div class="card-header" style="background-color: mediumorchid; color: white;">
        <h5 class="mb-0">Reporte de Usuarios</h5>
      </div>
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-md-3">
            <select class="form-select form-select-sm" v-model="filtros.tipo" @change="cargarDatos">
              <option value="todos">Todos los tipos</option>
              <option value="basico">Básico</option>
              <option value="premium">Premium</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select form-select-sm" v-model="filtros.estado" @change="cargarDatos">
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="bloqueado">Bloqueados</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select form-select-sm" v-model="filtros.ordenar" @change="cargarDatos">
              <option value="id">Por ID</option>
              <option value="publicaciones">Más publicaciones</option>
              <option value="vendidos">Más vendidos</option>
            </select>
          </div>
          <div class="col-md-3">
            <button class="btn btn-success btn-sm w-100" @click="generarPDF">
              <font-awesome-icon icon="file-pdf" /> Generar PDF
            </button>
          </div>
        </div>

        <!-- Tabla -->
        <div v-if="cargando" class="text-center py-3">
          <div class="spinner-border spinner-border-sm text-primary"></div>
        </div>
        <div v-else-if="usuarios.length === 0" class="text-center py-3">
          <p class="mb-0">No se encontraron usuarios</p>
        </div>
        <div v-else>
          <div class="table-responsive">
            <table class="table table-sm table-hover" id="tabla-usuarios">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Publicaciones</th>
                  <th>Vendidos</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usuarios" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.usuario }}</td>
                  <td>{{ user.nombre }} {{ user.apPaterno || '' }}</td>
                  <td>{{ user.correo }}</td>
                  <td>{{ user.tipo }}</td>
                  <td>{{ user.bloqueado ? 'Bloqueado' : 'Activo' }}</td>
                  <td>{{ user.totalPublicaciones || 0 }}</td>
                  <td>{{ user.totalVendidos || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="text-center">
            <small class="text-muted">Total: {{ usuarios.length }} usuarios</small>
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
  name: 'ReporteUsuarios',
  data() {
    return {
      usuarios: [],
      cargando: false,
      filtros: { tipo: 'todos', estado: 'todos', ordenar: 'id' }
    }
  },
  mounted() {
    this.cargarDatos()
  },
  methods: {
    async cargarDatos() {
      this.cargando = true
      try {
        let url = 'http://localhost:3000/api/usuarios?'
        const params = []
        if (this.filtros.tipo !== 'todos') params.push(`tipo=${this.filtros.tipo}`)
        if (this.filtros.estado === 'activo') params.push('bloqueado=false')
        if (this.filtros.estado === 'bloqueado') params.push('bloqueado=true')
        if (this.filtros.ordenar !== 'id') params.push(`orden=${this.filtros.ordenar}`)
        
        const res = await fetch(url + params.join('&'))
        if (res.ok) {
          this.usuarios = await res.json()
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.cargando = false
      }
    },
    async generarPDF() {
      try {
        await pdfService.generarPDFTabla('tabla-usuarios', {
          titulo: 'Reporte de Usuarios',
          nombreArchivo: 'reporte_usuarios',
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
.reporte-usuarios {
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