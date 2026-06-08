const express = require('express')
const { iniciarSesion } = require('../controladores/usuarioControl')

const enrutador = express.Router()

enrutador.post('/login', iniciarSesion)

module.exports = enrutador