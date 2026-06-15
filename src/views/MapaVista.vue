<template>
  <div class="mapa-container">
    <BarraLateral @buscar="aplicarFiltros" />
    
    <div class="contenido-principal">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div id="mapa" style="height: calc(100vh - 80px); width: 100%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraLateral from '@/components/BarraLateral.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'MapaVista',
  components: { BarraLateral },
  data() {
    return {
      mapa: null,
      todasPropiedades: [],
      marcadores: []
    }
  },
  mounted() {
    this.inicializarMapa()
    this.cargarPropiedades()
  },
  methods: {
    inicializarMapa() {
      this.mapa = L.map('mapa').setView([-17.9667, -67.1167], 13)
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB'
      }).addTo(this.mapa)
    },
    
    async cargarPropiedades() {
      try {
        const res = await fetch('http://localhost:3000/api/propiedades')
        if (res.ok) {
          this.todasPropiedades = await res.json()
          this.mostrarPropiedadesEnMapa(this.todasPropiedades)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    
    mostrarPropiedadesEnMapa(propiedades) {
      this.marcadores.forEach(m => this.mapa.removeLayer(m))
      this.marcadores = []
      
      propiedades.forEach(prop => {
        if (prop.latitud && prop.longitud) {
          // Configurar icono
          const tamaño = prop.destacada ? 42 : 32
          const color = prop.destacada ? 'mediumorchid' : '#6c757d'
          
          // Icono de casa con FontAwesome
          const iconHtml = `
            <div style="
              background-color: ${color};
              width: ${tamaño}px;
              height: ${tamaño}px;
              border-radius: 50% ${tamaño/2}px ${tamaño/2}px 50%;
              transform: rotate(45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
              cursor: pointer;
              transition: all 0.2s;
            ">
              <i class="fas fa-home" style="color: white; font-size: ${tamaño/2}px; transform: rotate(-45deg);"></i>
            </div>
          `
          
          // Contenido del popup con imagen para destacadas
          let popupContent
          if (prop.destacada && prop.imagenPrincipal) {
            popupContent = `
              <div style="min-width: 220px;">
                <img src="${prop.imagenPrincipal}" 
                     style="width: 100%; height: 140px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;">
                <h6 style="margin: 0 0 5px 0; color: mediumorchid;">✨ ${prop.titulo}</h6>
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${prop.ubicacion}</p>
                <p style="margin: 0 0 5px 0; font-weight: bold; color: mediumorchid;">$${prop.precio.toLocaleString()}</p>
                <p style="margin: 0; font-size: 11px; color: #999;">Superficie: ${prop.superficie} m²</p>
                <a href="/propiedad/${prop.id}" style="display: block; margin-top: 8px; text-align: center;">Ver detalle →</a>
              </div>
            `
          } else {
            popupContent = `
              <div style="min-width: 180px;">
                <h6 style="margin: 0 0 5px 0;">${prop.titulo}</h6>
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${prop.ubicacion}</p>
                <p style="margin: 0 0 5px 0; font-weight: bold;">$${prop.precio.toLocaleString()}</p>
                <a href="/propiedad/${prop.id}" style="display: block; margin-top: 5px; text-align: center;">Ver detalle →</a>
              </div>
            `
          }
          
          const marker = L.marker([prop.latitud, prop.longitud], {
            icon: L.divIcon({
              html: iconHtml,
              iconSize: [tamaño, tamaño],
              popupAnchor: [0, -tamaño/2],
              className: 'custom-marker'
            })
          }).addTo(this.mapa)
          
          marker.bindPopup(popupContent)
          
          // Hover: abrir popup automáticamente
          marker.on('mouseover', function() {
            this.openPopup()
          })
          marker.on('mouseout', function() {
            this.closePopup()
          })
          
          this.marcadores.push(marker)
        }
      })
    },
    
    aplicarFiltros(filtros) {
      let filtradas = [...this.todasPropiedades]
      
      if (filtros.texto && filtros.texto.trim()) {
        const texto = filtros.texto.toLowerCase()
        filtradas = filtradas.filter(p => 
          p.titulo.toLowerCase().includes(texto) ||
          p.ubicacion.toLowerCase().includes(texto)
        )
      }
      
      if (filtros.categoria && filtros.categoria !== 'todos') {
        const mapa = { 'casa': 1, 'departamento': 2, 'terreno': 3 }
        filtradas = filtradas.filter(p => p.categoria === mapa[filtros.categoria])
      }
      
      if (filtros.ciudad && filtros.ciudad !== 'todas') {
        filtradas = filtradas.filter(p => p.ciudad === filtros.ciudad)
      }
      
      if (filtros.precioMin) {
        filtradas = filtradas.filter(p => p.precio >= filtros.precioMin)
      }
      if (filtros.precioMax && filtros.precioMax !== Infinity) {
        filtradas = filtradas.filter(p => p.precio <= filtros.precioMax)
      }
      
      if (filtros.superficieMin) {
        filtradas = filtradas.filter(p => p.superficie >= filtros.superficieMin)
      }
      if (filtros.superficieMax && filtros.superficieMax !== Infinity) {
        filtradas = filtradas.filter(p => p.superficie <= filtros.superficieMax)
      }
      
      this.mostrarPropiedadesEnMapa(filtradas)
    }
  }
}
</script>

<style scoped>
.mapa-container {
  background-color: lavender;
  min-height: 100vh;
}

.contenido-principal {
  margin-left: 280px;
  padding: 20px;
}

@media (max-width: 768px) {
  .contenido-principal {
    margin-left: 0;
  }
}

:deep(.custom-marker) {
  background: transparent !important;
  border: none !important;
}

:deep(.leaflet-popup-content) {
  min-width: 220px;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}
</style>