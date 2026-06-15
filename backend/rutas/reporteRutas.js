const express = require('express')
const { crearReporte, obtenerReportes } = require('../controladores/reporteControl')
const enrutador = express.Router()

enrutador.post('/', crearReporte)
enrutador.get('/', obtenerReportes)

module.exports = enrutador