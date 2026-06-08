const express = require('express')
const { iniciarSesion, registrar } = require('../controladores/usuarioControl')

const enrutador = express.Router()

enrutador.post('/login', iniciarSesion)
enrutador.post('/registro', registrar)

module.exports = enrutador