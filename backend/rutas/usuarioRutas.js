const express = require('express')
const { 
    iniciarSesion, 
    registrar, 
    obtenerUsuarioActual,
    actualizarPerfil,
    obtenerUsuarios, 
    toggleBloqueoUsuario
} = require('../controladores/usuarioControl')
const { obtenerEstadisticas, obtenerPropiedadesReporte } = require('../controladores/estadisticasControl')
const { obtenerPagosPremium } = require('../controladores/pagoPremiumControl')
const enrutador = express.Router()
const { crearReporte, obtenerReportes, actualizarEstadoReporte } = require('../controladores/reporteControl')

// Autenticación
enrutador.post('/login', iniciarSesion)
enrutador.post('/registro', registrar)

// Perfil
enrutador.get('/usuarios/:usuarioId', obtenerUsuarioActual)
enrutador.put('/usuarios/perfil', actualizarPerfil)

// Estadísticas (dashboard)
enrutador.get('/estadisticas', obtenerEstadisticas)

// Usuarios (admin)
enrutador.get('/usuarios', obtenerUsuarios)
enrutador.put('/usuarios/:id/bloqueo', toggleBloqueoUsuario)

// Propiedades (admin - reportes)
enrutador.get('/propiedades/reporte', obtenerPropiedadesReporte)

// Pagos Premium
enrutador.get('/pagos-premium', obtenerPagosPremium)

// Reportes
enrutador.post('/reportes', crearReporte)
enrutador.get('/reportes', obtenerReportes)
enrutador.put('/reportes/:id', actualizarEstadoReporte)

module.exports = enrutador