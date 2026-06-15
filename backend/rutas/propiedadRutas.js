const express = require('express')
const { obtenerTodas, obtenerPorId, crearPropiedad, obtenerCiudades } = require('../controladores/propiedadControl')
const enrutador = express.Router()

enrutador.get('/', obtenerTodas)
enrutador.get('/ciudades', obtenerCiudades)
enrutador.get('/:id', obtenerPorId)
enrutador.post('/', crearPropiedad)

module.exports = enrutador