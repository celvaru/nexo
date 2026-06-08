const express = require('express')
const { obtenerTodas } = require('../controladores/propiedadControl')

const enrutador = express.Router()

enrutador.get('/', obtenerTodas)

module.exports = enrutador