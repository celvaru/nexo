const iniciarSesion = (req, res) => {
    const { correo, password } = req.body
    
    const sql = 'SELECT id, nombre, apPaterno, apMaterno, correo, usuario FROM Usuario WHERE (correo = ? OR usuario = ?) AND password = ?'
    
    req.db.query(sql, [correo, correo, password], (error, resultados) => {
        if (error) {
            return res.status(500).json({ error: 'Error en el servidor' })
        }
        if (resultados.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
        }
        res.json({ exito: true, usuario: resultados[0] })
    })
}

module.exports = { iniciarSesion }