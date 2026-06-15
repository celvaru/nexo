const express = require('express')
const { iniciarSesion, registrar, obtenerUsuarioActual, actualizarPerfil } = require('../controladores/usuarioControl')
const enrutador = express.Router()

enrutador.post('/login', iniciarSesion)
enrutador.post('/registro', registrar)
enrutador.get('/usuario/:usuarioId', obtenerUsuarioActual)
enrutador.put('/usuario', actualizarPerfil)

module.exports = enrutador