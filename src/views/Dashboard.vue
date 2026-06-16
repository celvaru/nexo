<template>
  <div class="dashboard-container">
    <div class="contenido-principal">
      <div class="container-fluid">
        
        <h2 class="mb-4">Panel de Administración</h2>

        <!-- Tarjetas de estadísticas -->
        <div class="row g-4 mb-5">
          <div class="col-md-3">
            <div class="card text-white" style="background-color: mediumorchid;">
              <div class="card-body">
                <h5 class="card-title">Usuarios</h5>
                <h2>{{ estadisticas.totalUsuarios?.total || 0 }}</h2>
                <small>{{ estadisticas.usuariosPremium?.total || 0 }} premium</small>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card text-white bg-success">
              <div class="card-body">
                <h5 class="card-title">Propiedades</h5>
                <h2>{{ estadisticas.totalPropiedades?.total || 0 }}</h2>
                <small>{{ estadisticas.propiedadesDestacadas?.total || 0 }} destacadas</small>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card text-white bg-warning">
              <div class="card-body">
                <h5 class="card-title">Reportes Pendientes</h5>
                <h2>{{ reportesPendientes.length }}</h2>
                <small>3 reportes = bloqueo automático</small>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card text-white bg-info">
              <div class="card-body">
                <h5 class="card-title">Ingresos</h5>
                <h2>${{ (estadisticas.ingresosPremium?.total || 0).toLocaleString() }}</h2>
                <small>Pagos activos</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de Reportes Pendientes -->
        <div class="card mb-5" v-if="reportesPendientes.length > 0">
            <div class="card-header" style="background-color: mediumorchid; color: white;">
                <h4 class="mb-0">
                <font-awesome-icon icon="flag" /> Reportes Pendientes ({{ reportesPendientes.length }})
                </h4>
            </div>
            <div class="card-body">
                <div class="alert alert-info">
                <font-awesome-icon icon="info-circle" /> Un usuario con <strong>3 reportes pendientes</strong> será bloqueado automáticamente.
                </div>
                <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Entidad</th>
                        <th>Motivo</th>
                        <th>Descripción</th>
                        <th>Reportado por</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="reporte in reportesPendientes" :key="reporte.id">
                        <td>{{ reporte.id }}</td>
                        <td>
                        <span class="badge" :class="reporte.tipo === 'propiedad' ? 'bg-primary' : 'bg-info'">
                            {{ reporte.tipo }}
                        </span>
                        </td>
                        <td>{{ reporte.entidadNombre || reporte.entidadId }}</td>
                        <td>{{ getMotivo(reporte.motivo) }}</td>
                        <td style="max-width: 200px;">
                        <span class="d-inline-block text-truncate" style="max-width: 180px;" :title="reporte.descripcion">
                            {{ reporte.descripcion || 'Sin descripción' }}
                        </span>
                        </td>
                        <td>{{ reporte.reportadoPorUsuario }}</td>
                        <td>{{ new Date(reporte.fecha).toLocaleDateString() }}</td>
                        <td>
                        <button class="btn btn-sm" style="background-color: mediumorchid; color: white; border: none;" @click="anularReporte(reporte.id)">
                            <font-awesome-icon icon="check" /> Anular
                        </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>

        <!-- Sección de Usuarios -->
        <div class="card mb-5">
          <div class="card-header" style="background-color: mediumorchid; color: white;">
            <h4 class="mb-0">Gestión de Usuarios</h4>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-12">
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="busquedaUsuario"
                  @input="buscarUsuarios"
                  placeholder="Buscar por nombre, usuario o email..."
                >
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in usuarios" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.usuario }}</td>
                    <td>{{ user.nombre }} {{ user.apPaterno }}</td>
                    <td>{{ user.correo }}</td>
                    <td>{{ user.tipo }}</td>
                    <td>{{ user.bloqueado ? 'Bloqueado' : 'Activo' }}</td>
                    <td>
                      <button class="btn btn-sm" :class="user.bloqueado ? 'btn-success' : 'btn-danger'" @click="toggleBloqueo(user)">
                        {{ user.bloqueado ? 'Desbloquear' : 'Bloquear' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sección de Propiedades -->
        <div class="card">
          <div class="card-header" style="background-color: mediumorchid; color: white;">
            <h4 class="mb-0">Gestión de Propiedades</h4>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-12">
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="busquedaPropiedad"
                  @input="buscarPropiedades"
                  placeholder="Buscar por título o vendedor..."
                >
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Vendedor</th>
                    <th>Precio</th>
                    <th>Ciudad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prop in propiedades" :key="prop.id">
                    <td>{{ prop.id }}</td>
                    <td>{{ prop.titulo }}</td>
                    <td>{{ prop.vendedor || prop.usuario }}</td>
                    <td>${{ prop.precio.toLocaleString() }}</td>
                    <td>{{ prop.ciudad }}</td>
                    <td>
                      {{ prop.vendida ? 'Vendida' : 'Disponible' }}
                      <span v-if="prop.reportada" class="badge bg-warning ms-1">Reportada</span>
                      <span v-if="prop.oculta" class="badge bg-secondary ms-1">Oculta</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-danger" @click="toggleOculta(prop)">
                        {{ prop.oculta ? 'Mostrar' : 'Ocultar' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      estadisticas: {},
      usuarios: [],
      propiedades: [],
      reportesPendientes: [],
      busquedaUsuario: '',
      busquedaPropiedad: '',
      cargandoUsuarios: false,
      cargandoPropiedades: false
    }
  },
  mounted() {
    this.cargarEstadisticas()
    this.buscarUsuarios()
    this.buscarPropiedades()
    this.cargarReportesPendientes()
  },
  methods: {
    getMotivo(motivo) {
        const motivos = {
        1: 'Estafa',
        2: 'Spam',
        3: 'Contenido inapropiado',
        4: 'Información falsa',
        5: 'Otro'
        }
        return motivos[motivo] || motivo
    },
    
    async cargarEstadisticas() {
      try {
        const res = await fetch('http://localhost:3000/api/estadisticas')
        if (res.ok) this.estadisticas = await res.json()
      } catch (error) {
        console.error('Error:', error)
      }
    },
    
    async cargarReportesPendientes() {
      try {
        const res = await fetch('http://localhost:3000/api/reportes?estado=pendiente')
        if (res.ok) {
          this.reportesPendientes = await res.json()
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    
    async anularReporte(id) {
      if (!confirm('¿Estás seguro de anular este reporte?')) return
      
      const admin = JSON.parse(localStorage.getItem('usuario'))
      
      try {
        const res = await fetch(`http://localhost:3000/api/reportes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estado: 'revisado',
            adminId: admin.id,
            comentario: 'Reporte anulado por el administrador',
            accionTomada: 'anulado'
          })
        })
        
        if (res.ok) {
          alert('Reporte anulado correctamente')
          this.cargarReportesPendientes()
          this.cargarEstadisticas()
        } else {
          alert('Error al anular el reporte')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error de conexión')
      }
    },
    
    async buscarUsuarios() {
      this.cargandoUsuarios = true
      try {
        const params = new URLSearchParams()
        if (this.busquedaUsuario.trim()) params.append('busqueda', this.busquedaUsuario)
        const res = await fetch(`http://localhost:3000/api/usuarios?${params}`)
        if (res.ok) this.usuarios = await res.json()
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.cargandoUsuarios = false
      }
    },
    
    async buscarPropiedades() {
      this.cargandoPropiedades = true
      try {
        const params = new URLSearchParams()
        if (this.busquedaPropiedad.trim()) params.append('busqueda', this.busquedaPropiedad)
        const res = await fetch(`http://localhost:3000/api/propiedades/reporte?${params}`)
        if (res.ok) this.propiedades = await res.json()
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.cargandoPropiedades = false
      }
    },
    
    async toggleBloqueo(user) {
      const bloquear = !user.bloqueado
      try {
        const res = await fetch(`http://localhost:3000/api/usuarios/${user.id}/bloqueo`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bloquear })
        })
        if (res.ok) {
          user.bloqueado = bloquear
          this.cargarEstadisticas()
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    
    async toggleOculta(prop) {
      const oculta = !prop.oculta
      try {
        const res = await fetch(`http://localhost:3000/api/propiedades/${prop.id}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vendida: prop.vendida || false, oculta })
        })
        if (res.ok) {
          prop.oculta = oculta
          this.cargarEstadisticas()
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  background-color: lavender;
  min-height: 100vh;
}

.contenido-principal {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  transition: none;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}
.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}
.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-primary {
  background-color: mediumorchid;
  border-color: mediumorchid;
}
.btn-primary:hover {
  background-color: mediumpurple;
  border-color: mediumpurple;
}

.badge {
  font-size: 0.8rem;
}

.card-header {
  background-color: mediumorchid;
}
</style>