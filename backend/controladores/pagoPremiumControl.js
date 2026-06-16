const obtenerPagosPremium = (req, res) => {
    const sql = `
        SELECT p.*, u.usuario, u.nombre 
        FROM PagoPremium p
        INNER JOIN Usuario u ON p.usuarioId = u.id
        ORDER BY p.fechaInicio DESC
    `
    
    req.db.query(sql, (error, datos) => {
        if (error) {
            console.error('Error en obtenerPagosPremium:', error)
            return res.status(500).json({ error: error.message })
        }
        res.json(datos)
    })
}

module.exports = { obtenerPagosPremium }