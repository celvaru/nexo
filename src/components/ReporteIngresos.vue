<template>
  <div class="reporte-ingresos">
    <div class="card">
      <div class="card-header" style="background-color: mediumorchid; color: white;">
        <h5 class="mb-0">Reporte de Ingresos Premium</h5>
      </div>
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-md-3">
            <input type="date" class="form-control form-control-sm" v-model="filtros.fechaDesde">
          </div>
          <div class="col-md-3">
            <input type="date" class="form-control form-control-sm" v-model="filtros.fechaHasta">
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary btn-sm w-100" @click="cargarDatos">
              <font-awesome-icon icon="search" /> Filtrar
            </button>
          </div>
          <div class="col-md-3">
            <button class="btn btn-success btn-sm w-100" @click="generarPDF">
              <font-awesome-icon icon="file-pdf" /> Generar PDF
            </button>
          </div>
        </div>

        <!-- Resumen -->
        <div class="row g-2 mb-3">
          <div class="col-md-4">
            <div class="card bg-success text-white">
              <div class="card-body py-2">
                <h6 class="mb-0">Total anual</h6>
                <h4 class="mb-0">${{ totalAnual.toLocaleString() }}</h4>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-primary text-white">
              <div class="card-body py-2">
                <h6 class="mb-0">Suscripciones anuales</h6>
                <h4 class="mb-0">{{ suscripcionesAnuales }}</h4>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-warning text-white">
              <div class="card-body py-2">
                <h6 class="mb-0">Mes con mayor ingreso</h6>
                <h4 class="mb-0">${{ mesMayorIngreso.toLocaleString() }}</h4>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla -->
        <div v-if="cargando" class="text-center py-3">
          <div class="spinner-border spinner-border-sm text-primary"></div>
        </div>
        <div v-else-if="gananciasMensuales.length === 0" class="text-center py-3">
          <p class="mb-0">No hay datos en el rango seleccionado</p>
        </div>
        <div v-else>
          <div class="table-responsive">
            <table class="table table-sm table-hover" id="tabla-ingresos">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th class="text-end">Ingresos</th>
                  <th class="text-end">Suscripciones</th>
                  <th class="text-end">Promedio</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in gananciasMensuales" :key="item.mes">
                  <td>{{ item.mes }}</td>
                  <td class="text-end">${{ item.total.toLocaleString() }}</td>
                  <td class="text-end">{{ item.cantidad }}</td>
                  <td class="text-end">${{ item.promedio.toLocaleString() }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="table-primary fw-bold">
                  <td>TOTAL</td>
                  <td class="text-end">${{ totalAnual.toLocaleString() }}</td>
                  <td class="text-end">{{ suscripcionesAnuales }}</td>
                  <td class="text-end">${{ promedioAnual.toLocaleString() }}</td>
                </tr>
              </tfoot>
            </table>
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
  name: 'ReporteIngresos',
  data() {
    return {
      todosLosPagos: [],
      pagosFiltrados: [],
      gananciasMensuales: [],
      cargando: false,
      totalAnual: 0,
      suscripcionesAnuales: 0,
      promedioAnual: 0,
      mesMayorIngreso: 0,
      filtros: { fechaDesde: '', fechaHasta: '' }
    }
  },
  mounted() {
    this.cargarDatos()
  },
  methods: {
    async cargarDatos() {
      this.cargando = true;
        try {
        const res = await fetch('http://localhost:3000/api/pagos-premium')
        if (res.ok) {
          this.todosLosPagos = await res.json()
          this.aplicarFiltros()
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.cargando = false
      }
    },
    
    aplicarFiltros() {
      let datos = [...this.todosLosPagos]
      
      if (this.filtros.fechaDesde) {
        const desde = new Date(this.filtros.fechaDesde)
        datos = datos.filter(p => new Date(p.fechaInicio) >= desde)
      }
      
      if (this.filtros.fechaHasta) {
        const hasta = new Date(this.filtros.fechaHasta)
        datos = datos.filter(p => new Date(p.fechaFin) <= hasta)
      }
      
      this.pagosFiltrados = datos
      this.calcularGanancias()
    },
    
    calcularGanancias() {
      // Agrupar por mes
      const grupos = {}
      
      this.pagosFiltrados.forEach(pago => {
        const fecha = new Date(pago.fechaInicio)
        const mes = fecha.toLocaleString('es-BO', { month: 'long', year: 'numeric' })
        
        if (!grupos[mes]) {
          grupos[mes] = { total: 0, cantidad: 0 }
        }
        grupos[mes].total += Number(pago.monto)
        grupos[mes].cantidad += 1
      })
      
      // Convertir a array
      this.gananciasMensuales = Object.entries(grupos).map(([mes, data]) => ({
        mes: mes.charAt(0).toUpperCase() + mes.slice(1),
        total: data.total,
        cantidad: data.cantidad,
        promedio: data.total / data.cantidad
      }))
      
      // Ordenar por fecha (más reciente primero)
      this.gananciasMensuales.sort((a, b) => {
        const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
        const aMes = a.mes.split(' ')[0].toLowerCase()
        const bMes = b.mes.split(' ')[0].toLowerCase()
        return meses.indexOf(bMes) - meses.indexOf(aMes)
      })
      
      // Calcular totales ANUALES (solo del año actual)
      const anioActual = new Date().getFullYear()
      const pagosAnuales = this.pagosFiltrados.filter(p => {
        const fecha = new Date(p.fechaInicio)
        return fecha.getFullYear() === anioActual
      })
      
      this.totalAnual = pagosAnuales.reduce((sum, p) => sum + Number(p.monto), 0)
      this.suscripcionesAnuales = pagosAnuales.length
      this.promedioAnual = this.suscripcionesAnuales > 0 
        ? this.totalAnual / this.suscripcionesAnuales 
        : 0
      
      // Mes con mayor ingreso
      this.mesMayorIngreso = this.gananciasMensuales.length > 0 
        ? Math.max(...this.gananciasMensuales.map(m => m.total))
        : 0
    },
    
    async generarPDF() {
      try {
        await pdfService.generarPDFTabla('tabla-ingresos', {
          titulo: 'Reporte de Ingresos Premium',
          nombreArchivo: 'reporte_ingresos',
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
.reporte-ingresos {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  background-color: mediumorchid !important;
}

.btn-primary {
  background-color: mediumorchid;
  border-color: mediumorchid;
}
.btn-primary:hover {
  background-color: mediumpurple;
  border-color: mediumpurple;
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

tfoot .table-primary {
  background-color: #e8d5f5 !important;
}
</style>