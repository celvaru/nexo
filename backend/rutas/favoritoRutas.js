const express = require('express')
const enrutador = express.Router()

// Obtener favoritos de un usuario
enrutador.get('/:usuarioId', (req, res) => {
    const { usuarioId } = req.params
    
    const sql = `
        SELECT p.*, 
               (SELECT url FROM Imagen WHERE propiedadId = p.id ORDER BY orden LIMIT 1) as imagenPrincipal
        FROM Favorito f
        INNER JOIN Propiedad p ON f.propiedadId = p.id
        WHERE f.usuarioId = ?
        ORDER BY f.fechaAgregado DESC
    `
    
    req.db.query(sql, [usuarioId], (error, datos) => {
        if (error) return res.status(500).json({ error: error.message })
        res.json(datos)
    })
})

// Agregar a favoritos
enrutador.post('/', (req, res) => {
    const { usuarioId, propiedadId } = req.body
    
    const sql = 'INSERT INTO Favorito (usuarioId, propiedadId) VALUES (?, ?)'
    req.db.query(sql, [usuarioId, propiedadId], (error, resultado) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Ya está en favoritos' })
            }
            return res.status(500).json({ error: error.message })
        }
        res.json({ exito: true, mensaje: 'Agregado a favoritos' })
    })
})

// Eliminar de favoritos
enrutador.delete('/', (req, res) => {
    const { usuarioId, propiedadId } = req.body
    
    const sql = 'DELETE FROM Favorito WHERE usuarioId = ? AND propiedadId = ?'
    req.db.query(sql, [usuarioId, propiedadId], (error, resultado) => {
        if (error) return res.status(500).json({ error: error.message })
        res.json({ exito: true, mensaje: 'Eliminado de favoritos' })
    })
})

module.exports = enrutador