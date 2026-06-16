const express = require('express')
const { 
    iniciarSesion, 
    registrar, 
    obtenerEstadisticas, 
    obtenerUsuarios, 
    toggleBloqueoUsuario,
    obtenerPropiedadesReporte,
    togglePropiedadEstado
} = require('../controladores/usuarioControl')
const enrutador = express.Router()

enrutador.post('/login', iniciarSesion)
enrutador.post('/registro', registrar)
enrutador.get('/estadisticas', obtenerEstadisticas)
enrutador.get('/usuarios', obtenerUsuarios)
enrutador.put('/usuarios/:id/bloqueo', toggleBloqueoUsuario)
enrutador.get('/propiedades/reporte', obtenerPropiedadesReporte)
enrutador.put('/propiedades/:id/estado', togglePropiedadEstado)

module.exports = enrutador