const crearPropiedad = (req, res) => {
    const { titulo, descripcion, precio, ubicacion, latitud, longitud, categoria, numHabitaciones, estacionamiento, superficie, usuarioId } = req.body
    
    // Verificar límite de publicaciones del usuario
    const verificarLimite = 'SELECT publicacionesRestantes, tipo FROM Usuario WHERE id = ?'
    
    req.db.query(verificarLimite, [usuarioId], (error, usuario) => {
        if (error) return res.status(500).json({ error: 'Error al verificar límite' })
        
        if (usuario[0].publicacionesRestantes <= 0 && usuario[0].tipo === 'basico') {
            return res.status(400).json({ error: 'Límite de publicaciones alcanzado. Actualiza a premium.' })
        }
        
        const sql = 'INSERT INTO Propiedad (titulo, descripcion, precio, ubicacion, latitud, longitud, categoria, numHabitaciones, estacionamiento, superficie, usuarioId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        
        req.db.query(sql, [titulo, descripcion, precio, ubicacion, latitud, longitud, categoria, numHabitaciones, estacionamiento, superficie, usuarioId], (error, resultado) => {
            if (error) return res.status(500).json({ error: 'Error al crear propiedad' })
            
            // Reducir publicacionesRestantes si es usuario básico
            if (usuario[0].tipo === 'basico') {
                const update = 'UPDATE Usuario SET publicacionesRestantes = publicacionesRestantes - 1 WHERE id = ?'
                req.db.query(update, [usuarioId])
            }
            
            res.json({ exito: true, mensaje: 'Propiedad creada', propiedadId: resultado.insertId })
        })
    })
}

const destacarPropiedad = (req, res) => {
    const { id, usuarioId } = req.body
    
    // Verificar si el usuario es premium
    const verificarPremium = 'SELECT tipo FROM Usuario WHERE id = ?'
    
    req.db.query(verificarPremium, [usuarioId], (error, usuario) => {
        if (error) return res.status(500).json({ error: 'Error al verificar' })
        if (usuario[0].tipo !== 'premium') {
            return res.status(403).json({ error: 'Solo usuarios premium pueden destacar propiedades' })
        }
        
        const sql = 'UPDATE Propiedad SET destacada = TRUE, fechaDestacado = CURDATE() WHERE id = ?'
        req.db.query(sql, [id], (error) => {
            if (error) return res.status(500).json({ error: 'Error al destacar' })
            res.json({ exito: true, mensaje: 'Propiedad destacada' })
        })
    })
}

const reportarPropiedad = (req, res) => {
    const { id } = req.body
    const sql = 'UPDATE Propiedad SET reportada = TRUE WHERE id = ?'
    
    req.db.query(sql, [id], (error) => {
        if (error) return res.status(500).json({ error: 'Error al reportar' })
        res.json({ exito: true, mensaje: 'Propiedad reportada' })
    })
}

const ocultarPropiedad = (req, res) => {
    const { id } = req.body
    const sql = 'UPDATE Propiedad SET oculta = TRUE WHERE id = ?'
    
    req.db.query(sql, [id], (error) => {
        if (error) return res.status(500).json({ error: 'Error al ocultar' })
        res.json({ exito: true, mensaje: 'Propiedad ocultada' })
    })
}

const registrarVisita = (req, res) => {
    const { propiedadId, visitanteId, ip } = req.body
    
    // Actualizar contador de visitas
    const updateVisitas = 'UPDATE Propiedad SET visitas = visitas + 1 WHERE id = ?'
    req.db.query(updateVisitas, [propiedadId])
    
    // Registrar en historial (solo para premium)
    const sql = 'INSERT INTO HistorialVisitas (propiedadId, visitanteId, ip) VALUES (?, ?, ?)'
    req.db.query(sql, [propiedadId, visitanteId, ip], (error) => {
        if (error) return res.status(500).json({ error: 'Error al registrar visita' })
        res.json({ exito: true })
    })
}