const crearReporte = (req, res) => {
    console.log('Recibiendo reporte:', req.body) // Para debug
    
    const { tipo, entidadId, motivo, descripcion, reportadoPor } = req.body
    
    // Validar campos requeridos
    if (!tipo || !entidadId || !motivo || !reportadoPor) {
        return res.status(400).json({ error: 'Faltan campos requeridos' })
    }
    
    if (![1, 2, 3, 4, 5].includes(motivo)) {
        return res.status(400).json({ error: 'Motivo inválido' })
    }
    
    const sql = `
        INSERT INTO Reporte (tipo, entidadId, motivo, descripcion, reportadoPor, estado)
        VALUES (?, ?, ?, ?, ?, 'pendiente')
    `
    
    req.db.query(sql, [tipo, entidadId, motivo, descripcion, reportadoPor], (error, resultado) => {
        if (error) {
            console.error('Error al crear reporte:', error)
            return res.status(500).json({ error: error.message })
        }
        
        // Si es una propiedad, marcarla como reportada
        if (tipo === 'propiedad') {
            const sqlProp = 'UPDATE Propiedad SET reportada = 1 WHERE id = ?'
            req.db.query(sqlProp, [entidadId], (err) => {
                if (err) console.error('Error marcando propiedad como reportada:', err)
            })
        }
        
        res.json({ exito: true, id: resultado.insertId, mensaje: 'Reporte enviado correctamente' })
    })
}

const obtenerReportes = (req, res) => {
    const { estado } = req.query
    
    let sql = `
        SELECT r.*, 
               u1.usuario as reportadoPorUsuario, 
               CASE 
                   WHEN r.tipo = 'propiedad' THEN (SELECT titulo FROM Propiedad WHERE id = r.entidadId)
                   WHEN r.tipo = 'usuario' THEN (SELECT usuario FROM Usuario WHERE id = r.entidadId)
               END as entidadNombre
        FROM Reporte r
        LEFT JOIN Usuario u1 ON r.reportadoPor = u1.id
        WHERE 1=1
    `
    const params = []
    
    if (estado && estado !== 'todos') {
        sql += ' AND r.estado = ?'
        params.push(estado)
    }
    
    sql += ' ORDER BY r.fecha DESC'
    
    req.db.query(sql, params, (error, datos) => {
        if (error) {
            console.error('Error al obtener reportes:', error)
            return res.status(500).json({ error: error.message })
        }
        res.json(datos)
    })
}

const actualizarEstadoReporte = (req, res) => {
    const { id } = req.params
    const { estado, adminId, comentario, accionTomada } = req.body
    
    if (!['pendiente', 'revisado', 'resuelto'].includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' })
    }
    
    const sql = 'UPDATE Reporte SET estado = ? WHERE id = ?'
    req.db.query(sql, [estado, id], (error, resultado) => {
        if (error) {
            console.error('Error al actualizar reporte:', error)
            return res.status(500).json({ error: error.message })
        }
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Reporte no encontrado' })
        }
        
        // Registrar en ReporteAdmin
        const sqlAdmin = `
            INSERT INTO ReporteAdmin (adminId, reporteId, comentario, accionTomada)
            VALUES (?, ?, ?, ?)
        `
        req.db.query(sqlAdmin, [adminId, id, comentario || 'Sin comentario', accionTomada || estado], (err) => {
            if (err) console.error('Error al registrar acción admin:', err)
        })
        
        res.json({ exito: true, mensaje: `Reporte actualizado a ${estado}` })
    })
}

module.exports = { crearReporte, obtenerReportes, actualizarEstadoReporte }