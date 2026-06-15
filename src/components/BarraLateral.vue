<template>
  <div class="barra-lateral p-3" style="background-color: lavender; width: 280px; position: fixed; left: 0; top: 56px; height: calc(100vh - 56px); overflow-y: auto;">
    
    <!-- Botones de vista -->
    <div class="btn-group w-100 mb-4" role="group">
      <button 
        type="button" 
        class="btn" 
        :class="$route.path === '/' ? 'btn-vista-activo' : 'btn-vista'" 
        @click="cambiarVista('lista')"
      >
        <font-awesome-icon icon="list" /> Lista
      </button>
      <button 
        type="button" 
        class="btn" 
        :class="$route.path === '/mapa' ? 'btn-vista-activo' : 'btn-vista'" 
        @click="cambiarVista('mapa')"
      >
        <font-awesome-icon icon="map" /> Mapa
      </button>
    </div>

    <h5 class="mb-3">Filtros</h5>
    
    <div class="mb-3">
      <input type="text" class="form-control" v-model="filtros.texto" placeholder="Buscar por título...">
    </div>

    <div class="mb-3">
      <select class="form-select" v-model="filtros.categoria">
        <option value="todos">Todas las categorías</option>
        <option value="casa">Casas</option>
        <option value="departamento">Departamentos</option>
        <option value="terreno">Terrenos</option>
      </select>
    </div>

    <div class="mb-3">
      <select class="form-select" v-model="filtros.precio">
        <option value="todos">Todos los precios</option>
        <option value="0-10000">$0 - $10,000</option>
        <option value="10000-50000">$10,000 - $50,000</option>
        <option value="50000-100000">$50,000 - $100,000</option>
        <option value="100000-200000">$100,000 - $200,000</option>
        <option value="200000-500000">$200,000 - $500,000</option>
        <option value="500000+">$500,000+</option>
      </select>
    </div>

    <div class="mb-3">
      <select class="form-select" v-model="filtros.superficie">
        <option value="todos">Todas las superficies</option>
        <option value="100-200">100 - 200 m²</option>
        <option value="200-500">200 - 500 m²</option>
        <option value="500-1000">500 - 1000 m²</option>
        <option value="1000+">1000+ m²</option>
      </select>
    </div>

    <div class="mb-3">
      <select class="form-select" v-model="filtros.ciudad">
        <option value="todas">Todas las ciudades</option>
        <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
      </select>
    </div>

    <div class="d-grid gap-2">
      <button class="btn btn-buscar" @click="buscar">
        <font-awesome-icon icon="search" /> Buscar
      </button>
      <button class="btn btn-limpiar" @click="limpiarFiltros">
        <font-awesome-icon icon="eraser" /> Limpiar filtros
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarraLateral',
  data() {
    return {
      ciudades: [],
      filtros: {
        texto: '',
        categoria: 'todos',
        precio: 'todos',
        superficie: 'todos',
        ciudad: 'todas'
      }
    }
  },
  mounted() {
    this.cargarCiudades()
  },
  methods: {
    async cargarCiudades() {
      try {
        const res = await fetch('http://localhost:3000/api/propiedades/ciudades')
        if (res.ok) this.ciudades = await res.json()
      } catch (error) {
        this.ciudades = ['Oruro', 'Cochabamba', 'La Paz']
      }
    },
    
    buscar() {
      const filtros = { ...this.filtros }
      
      if (filtros.precio !== 'todos') {
        const [min, max] = filtros.precio.split('-')
        filtros.precioMin = parseInt(min)
        filtros.precioMax = max === '+' ? Infinity : parseInt(max)
      }
      
      if (filtros.superficie !== 'todos') {
        const [min, max] = filtros.superficie.split('-')
        filtros.superficieMin = parseInt(min)
        filtros.superficieMax = max === '+' ? Infinity : parseInt(max)
      }
      
      this.$emit('buscar', filtros)
    },
    
    limpiarFiltros() {
      this.filtros = {
        texto: '',
        categoria: 'todos',
        precio: 'todos',
        superficie: 'todos',
        ciudad: 'todas'
      }
      this.buscar()
    },
    
    cambiarVista(vista) {
      if (vista === 'mapa') {
        this.$router.push('/mapa')
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.btn-vista, .btn-vista-activo {
  cursor: pointer;
}

.btn-vista {
  background-color: white;
  color: mediumorchid;
  border: 1px solid mediumorchid;
}

.btn-vista-activo {
  background-color: mediumorchid;
  color: white;
  border: 1px solid mediumorchid;
}

.btn-buscar {
  background-color: mediumorchid;
  color: white;
  border: none;
  cursor: pointer;
}

.btn-buscar:hover {
  background-color: mediumpurple;
  color: white;
}

.btn-limpiar {
  background-color: #6c757d;
  color: white;
  border: none;
  cursor: pointer;
}

.btn-limpiar:hover {
  background-color: #5a6268;
  color: white;
}
</style>