const express = require('express')
const { obtenerTodas, crearPropiedad, destacarPropiedad, reportarPropiedad, ocultarPropiedad, registrarVisita } = require('../controladores/propiedadControl')
const enrutador = express.Router()

enrutador.get('/', obtenerTodas)
enrutador.post('/', crearPropiedad)
enrutador.put('/destacar', destacarPropiedad)
enrutador.put('/reportar', reportarPropiedad)
enrutador.put('/ocultar', ocultarPropiedad)
enrutador.post('/visita', registrarVisita)

module.exports = enrutador