<template>
  <div class="dashboard-container">
    <div class="contenido-principal">
      <div class="container-fluid">
        
        <h2 class="mb-4">Panel de Administración</h2>

        <!-- Tarjetas de estadísticas -->
        <div class="row g-4 mb-5">
          <div class="col-md-3">
            <div class="card text-white bg-primary">
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
                <h5 class="card-title">Reportadas</h5>
                <h2>{{ estadisticas.propiedadesReportadas?.total || 0 }}</h2>
                <small>{{ estadisticas.usuariosBloqueados?.total || 0 }} bloqueados</small>
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

        <!-- Sección de Usuarios -->
        <div class="card mb-5">
          <div class="card-header">
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
              <table class="table table-hover">
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
                    <td>
                      <span class="badge" :class="user.tipo === 'premium' ? 'bg-warning' : 'bg-secondary'">
                        {{ user.tipo }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="user.bloqueado ? 'bg-danger' : 'bg-success'">
                        {{ user.bloqueado ? 'Bloqueado' : 'Activo' }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm" :class="user.bloqueado ? 'btn-success' : 'btn-danger'" 
                              @click="toggleBloqueo(user)">
                        {{ user.bloqueado ? 'Desbloquear' : 'Bloquear' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="usuarios.length === 0 && !cargandoUsuarios">
                  <tr>
                    <td colspan="7" class="text-center">No se encontraron usuarios</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sección de Propiedades -->
        <div class="card">
          <div class="card-header">
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
              <table class="table table-hover">
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
                      <span class="badge" :class="prop.vendida ? 'bg-success' : 'bg-primary'">
                        {{ prop.vendida ? 'Vendida' : 'Disponible' }}
                      </span>
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
                <tbody v-if="propiedades.length === 0 && !cargandoPropiedades">
                  <tr>
                    <td colspan="7" class="text-center">No se encontraron propiedades</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Indicadores de carga -->
        <div v-if="cargandoUsuarios || cargandoPropiedades" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
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
  },
  methods: {
    async cargarEstadisticas() {
      try {
        const res = await fetch('http://localhost:3000/api/estadisticas')
        if (res.ok) this.estadisticas = await res.json()
      } catch (error) {
        console.error('Error:', error)
      }
    },
    
    async buscarUsuarios() {
      this.cargandoUsuarios = true
      try {
        let url = 'http://localhost:3000/api/usuarios?'
        const params = []
        
        if (this.busquedaUsuario.trim()) {
          params.push(`busqueda=${encodeURIComponent(this.busquedaUsuario)}`)
        }
        
        const res = await fetch(url + params.join('&'))
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
        let url = 'http://localhost:3000/api/propiedades/reporte?'
        const params = []
        
        if (this.busquedaPropiedad.trim()) {
          params.push(`busqueda=${encodeURIComponent(this.busquedaPropiedad)}`)
        }
        
        const res = await fetch(url + params.join('&'))
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

.btn-sm {
  cursor: pointer;
}

.badge {
  font-size: 0.8rem;
}

.card-header {
  background-color: mediumorchid;
  color: white;
}
</style>