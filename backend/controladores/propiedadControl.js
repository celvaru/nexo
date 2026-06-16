const obtenerTodas = (req, res) => {
    const sql = `
        SELECT p.*, 
               CONCAT('http://localhost:3000/recursos/', p.id, '-001.jpg') as imagenPrincipal
        FROM Propiedad p 
        WHERE p.estado = TRUE AND p.oculta = FALSE
        ORDER BY p.id DESC
    `
    
    req.db.query(sql, (error, datos) => {
        if (error) return res.status(500).json({ error: error.message })
        res.json(datos)
    })
}

const obtenerPorId = (req, res) => {
    const { id } = req.params
    const sql = 'SELECT * FROM Propiedad WHERE id = ? AND estado = TRUE'
    
    req.db.query(sql, [id], (error, datos) => {
        if (error) return res.status(500).json({ error: error.message })
        if (datos.length === 0) return res.status(404).json({ error: 'Propiedad no encontrada' })
        res.json(datos[0])
    })
}

const crearPropiedad = (req, res) => {
    const { titulo, descripcion, precio, ubicacion, latitud, longitud, categoria, numHabitaciones, estacionamiento, superficie, usuarioId, destacada } = req.body
    
    const fechaDestacado = destacada ? new Date().toISOString().split('T')[0] : null
    
    const sql = `
        INSERT INTO Propiedad (titulo, descripcion, precio, ubicacion, latitud, longitud, categoria, numHabitaciones, estacionamiento, superficie, usuarioId, destacada, fechaDestacado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    req.db.query(sql, [titulo, descripcion, precio, ubicacion, latitud, longitud, categoria, numHabitaciones, estacionamiento, superficie, usuarioId, destacada || false, fechaDestacado], (error, resultado) => {
        if (error) return res.status(500).json({ error: error.message })
        res.json({ exito: true, id: resultado.insertId })
    })
}

const obtenerCiudades = (req, res) => {
    const sql = 'SELECT DISTINCT ciudad FROM Propiedad WHERE ciudad IS NOT NULL AND ciudad != "" ORDER BY ciudad'
    
    req.db.query(sql, (error, datos) => {
        if (error) return res.status(500).json({ error: error.message })
        const ciudades = datos.map(item => item.ciudad)
        res.json(ciudades)
    })
}

const togglePropiedadEstado = (req, res) => {
    const { id } = req.params
    const { vendida, oculta } = req.body
    
    const sql = 'UPDATE Propiedad SET vendida = ?, oculta = ? WHERE id = ?'
    req.db.query(sql, [vendida || false, oculta || false, id], (error, resultado) => {
        if (error) return res.status(500).json({ error: error.message })
        res.json({ exito: true })
    })
}

module.exports = { obtenerTodas, obtenerPorId, crearPropiedad, obtenerCiudades, togglePropiedadEstado }