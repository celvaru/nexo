<template>
  <div>
    <!-- Modal -->
    <div class="modal" :class="{ 'd-block': mostrar }" tabindex="-1" v-if="mostrar">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="background-color: mediumorchid; color: white;">
            <h5 class="modal-title">
              <font-awesome-icon icon="flag" /> Reportar Propiedad
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Motivo del reporte</label>
              <select class="form-select" v-model="reporte.motivo">
                <option value="">Seleccionar motivo...</option>
                <option value="1">Estafa</option>
                <option value="2">Spam</option>
                <option value="3">Contenido inapropiado</option>
                <option value="4">Información falsa</option>
                <option value="5">Otro</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Descripción</label>
              <textarea 
                class="form-control" 
                v-model="reporte.descripcion" 
                rows="3" 
                placeholder="Describe el problema en detalle..."
              ></textarea>
            </div>
            <div class="alert alert-info small">
              <font-awesome-icon icon="info-circle" /> Tu reporte será revisado por el equipo de administración.
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrar">
              <font-awesome-icon icon="times" /> Cancelar
            </button>
            <button class="btn btn-danger" @click="enviar" :disabled="!reporte.motivo || enviando">
              <font-awesome-icon icon="paper-plane" /> 
              {{ enviando ? 'Enviando...' : 'Enviar reporte' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" v-if="mostrar"></div>
  </div>
</template>

<script>
export default {
  name: 'ModalReporte',
  props: {
    mostrar: {
      type: Boolean,
      default: false
    },
    propiedadId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      reporte: {
        motivo: '',
        descripcion: ''
      },
      enviando: false
    }
  },
  watch: {
    mostrar(val) {
      if (!val) {
        this.reporte.motivo = ''
        this.reporte.descripcion = ''
      }
    }
  },
  methods: {
    cerrar() {
      this.$emit('cerrar')
    },
    async enviar() {
      const usuario = localStorage.getItem('usuario')
      if (!usuario) {
        alert('Debes iniciar sesión para reportar')
        this.cerrar()
        return
      }

      this.enviando = true
      
      try {
        const data = {
          tipo: 'propiedad',
          entidadId: this.propiedadId,
          motivo: parseInt(this.reporte.motivo),
          descripcion: this.reporte.descripcion || 'Sin descripción adicional',
          reportadoPor: JSON.parse(usuario).id
        }

        const res = await fetch('http://localhost:3000/api/reportes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (res.ok) {
          alert('✅ Reporte enviado correctamente')
          this.cerrar()
          this.$emit('enviado')
        } else {
          const error = await res.json()
          alert('❌ Error: ' + (error.message || 'No se pudo enviar el reporte'))
        }
      } catch (error) {
        console.error('Error:', error)
        alert('❌ Error de conexión. Intenta nuevamente.')
      } finally {
        this.enviando = false
      }
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}
.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}
.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
</style>