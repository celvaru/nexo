<template>
  <div class="inicio-container">
    <BarraLateral @buscar="aplicarFiltros" />
    
    <div class="contenido-principal">
      <div class="container-fluid">
        
        <!-- Sección destacados (siempre visible) -->
        <div v-if="propiedadesDestacadas.length > 0" class="seccion-destacados mt-3 mb-5 p-3 rounded">
          <h4 class="mb-3">✨ Propiedades destacadas</h4>
          <div class="row g-4">
            <div v-for="propiedad in propiedadesDestacadas" :key="propiedad.id" class="col-md-6 col-lg-4">
              <TarjetaPropiedad 
                :propiedad="propiedad"
                :es-favorito="esFavorito(propiedad.id)"
                @toggle-favorito="toggleFavorito"
              />
            </div>
          </div>
        </div>

        <hr v-if="propiedadesDestacadas.length > 0" class="my-4">

        <!-- Resto de propiedades -->
        <div class="d-flex justify-content-between align-items-center mt-3 mb-3">
        </div>

        <div v-if="cargando" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        
        <div v-else-if="propiedadesFiltradas.length === 0" class="text-center py-5">
          <p class="lead">No se encontraron propiedades</p>
        </div>
        
        <div v-else>
          <div class="row g-4">
            <div v-for="propiedad in propiedadesPaginadas" :key="propiedad.id" class="col-md-6 col-lg-3">
              <TarjetaPropiedad 
                :propiedad="propiedad"
                :es-favorito="esFavorito(propiedad.id)"
                @toggle-favorito="toggleFavorito"
              />
            </div>
          </div>
          
          <!-- Paginación -->
          <div class="d-flex justify-content-center mt-4">
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                  <a class="page-link" href="#" @click.prevent="cambiarPagina(paginaActual - 1)">Anterior</a>
                </li>
                <li v-for="pagina in totalPaginas" :key="pagina" class="page-item" :class="{ active: paginaActual === pagina }">
                  <a class="page-link" href="#" @click.prevent="cambiarPagina(pagina)">{{ pagina }}</a>
                </li>
                <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                  <a class="page-link" href="#" @click.prevent="cambiarPagina(paginaActual + 1)">Siguiente</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraLateral from '@/components/BarraLateral.vue'
import TarjetaPropiedad from '@/components/TarjetaPropiedad.vue'

export default {
  name: 'InicioVista',
  components: { BarraLateral, TarjetaPropiedad },
  data() {
    return {
      todasPropiedades: [],
      propiedadesFiltradas: [],
      cargando: true,
      paginaActual: 1,
      itemsPorPagina: 9,
      favoritos: []
    }
  },
  computed: {
    propiedadesDestacadas() {
      return this.todasPropiedades.filter(p => p.destacada)
    },
    totalPaginas() {
      return Math.ceil(this.propiedadesFiltradas.length / this.itemsPorPagina)
    },
    propiedadesPaginadas() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina
      return this.propiedadesFiltradas.slice(inicio, inicio + this.itemsPorPagina)
    }
  },
  mounted() {
    this.cargarPropiedades()
    this.cargarFavoritos()
  },
  methods: {
    async cargarPropiedades() {
      this.cargando = true
      try {
        const res = await fetch('http://localhost:3000/api/propiedades')
        if (res.ok) {
          this.todasPropiedades = await res.json()
          this.propiedadesFiltradas = [...this.todasPropiedades]
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.cargando = false
      }
    },
    
    aplicarFiltros(filtros) {
      let filtradas = [...this.todasPropiedades]
      
      // Texto
      if (filtros.texto && filtros.texto.trim()) {
        const texto = filtros.texto.toLowerCase()
        filtradas = filtradas.filter(p => 
          p.titulo.toLowerCase().includes(texto) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(texto)) ||
          p.ubicacion.toLowerCase().includes(texto)
        )
      }
      
      // Categoría
      if (filtros.categoria && filtros.categoria !== 'todos') {
        const mapa = { 'casa': 1, 'departamento': 2, 'terreno': 3 }
        filtradas = filtradas.filter(p => p.categoria === mapa[filtros.categoria])
      }
      
      // Ciudad
      if (filtros.ciudad && filtros.ciudad !== 'todas') {
        filtradas = filtradas.filter(p => p.ciudad === filtros.ciudad)
      }
      
      // Precio
      if (filtros.precioMin) {
        filtradas = filtradas.filter(p => p.precio >= filtros.precioMin)
      }
      if (filtros.precioMax && filtros.precioMax !== Infinity) {
        filtradas = filtradas.filter(p => p.precio <= filtros.precioMax)
      }
      
      // Superficie
      if (filtros.superficieMin) {
        filtradas = filtradas.filter(p => p.superficie >= filtros.superficieMin)
      }
      if (filtros.superficieMax && filtros.superficieMax !== Infinity) {
        filtradas = filtradas.filter(p => p.superficie <= filtros.superficieMax)
      }
      
      this.propiedadesFiltradas = filtradas
      this.paginaActual = 1
    },
    
    cambiarPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    
    cargarFavoritos() {
      const usuario = localStorage.getItem('usuario')
      if (usuario) {
        const favs = localStorage.getItem(`favoritos_${JSON.parse(usuario).id}`)
        this.favoritos = favs ? JSON.parse(favs) : []
      }
    },
    
    esFavorito(id) {
      return this.favoritos.includes(id)
    },
    
    toggleFavorito(id) {
      const usuario = localStorage.getItem('usuario')
      if (!usuario) {
        alert('Debes iniciar sesión')
        this.$router.push('/login')
        return
      }
      const index = this.favoritos.indexOf(id)
      index > -1 ? this.favoritos.splice(index, 1) : this.favoritos.push(id)
      localStorage.setItem(`favoritos_${JSON.parse(usuario).id}`, JSON.stringify(this.favoritos))
    }
  }
}
</script>

<style scoped>
.inicio-container {
  background-color: lavender;
  min-height: 100vh;
}
.contenido-principal {
  margin-left: 280px;
  padding: 20px;
}
.seccion-destacados {
  background-color: #d8bfd8;
  border: 1px solid mediumpurple;
}
.pagination .page-link {
  color: mediumpurple;
}
.pagination .active .page-link {
  background-color: mediumpurple;
  border-color: mediumpurple;
  color: white;
}
.pagination .page-link:hover {
  background-color: mediumorchid;
  border-color: mediumorchid;
  color: white;
}
@media (max-width: 768px) {
  .contenido-principal {
    margin-left: 0;
  }
}
</style>