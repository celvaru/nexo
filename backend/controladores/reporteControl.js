const crearReporte = (req, res) => {
    const { tipo, entidadId, motivo, descripcion, reportadoPor } = req.body
    
    const sql = 'INSERT INTO Reporte (tipo, entidadId, motivo, descripcion, reportadoPor) VALUES (?, ?, ?, ?, ?)'
    
    req.db.query(sql, [tipo, entidadId, motivo, descripcion || '', reportadoPor], (error, resultado) => {
        if (error) return res.status(500).json({ error: 'Error al crear reporte' })
        res.json({ exito: true, mensaje: 'Reporte enviado', reporteId: resultado.insertId })
    })
}

const obtenerReportes = (req, res) => {
    const sql = 'SELECT * FROM Reporte WHERE estado = "pendiente" ORDER BY fecha DESC'
    
    req.db.query(sql, (error, datos) => {
        if (error) return res.status(500).json({ error: 'Error al obtener reportes' })
        res.json(datos)
    })
}

module.exports = { crearReporte, obtenerReportes }