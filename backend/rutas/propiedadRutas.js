const express = require('express')
const { obtenerTodas, obtenerPorId, crearPropiedad, obtenerCiudades, togglePropiedadEstado } = require('../controladores/propiedadControl')
const enrutador = express.Router()

enrutador.get('/', obtenerTodas)
enrutador.get('/ciudades', obtenerCiudades)
enrutador.get('/:id', obtenerPorId)
enrutador.post('/', crearPropiedad)
enrutador.put('/:id/estado', togglePropiedadEstado)

enrutador.post('/:id/visita', (req, res) => {
    const { id } = req.params
    const { visitanteId, ip } = req.body
    
    // Incrementar contador de visitas
    const sqlUpdate = 'UPDATE Propiedad SET visitas = visitas + 1 WHERE id = ?'
    req.db.query(sqlUpdate, [id], (error) => {
        if (error) return res.status(500).json({ error: error.message })
        
        // Registrar en historial
        const sqlHistorial = 'INSERT INTO HistorialVisitas (propiedadId, visitanteId, ip) VALUES (?, ?, ?)'
        req.db.query(sqlHistorial, [id, visitanteId || null, ip || null], (err) => {
            if (err) console.error('Error al registrar historial:', err)
        })
        
        res.json({ exito: true })
    })
})

module.exports = enrutador