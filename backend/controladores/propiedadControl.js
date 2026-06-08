const obtenerTodas = (req, res) => {
    req.db.query('SELECT * FROM Propiedad', (error, datos) => {
        if (error) {
            return res.status(500).json({ error: error })
        }
        res.json(datos)
    })
}

module.exports = { obtenerTodas }