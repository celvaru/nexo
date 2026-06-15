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

const registrar = (req, res) => {
    const { nombre, apPaterno, apMaterno, correo, usuario, password, celular } = req.body
    
    const sql = 'INSERT INTO Usuario (nombre, apPaterno, apMaterno, correo, usuario, password, celular) VALUES (?, ?, ?, ?, ?, ?, ?)'
    
    req.db.query(sql, [nombre, apPaterno, apMaterno, correo, usuario, password, celular], (error, resultado) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El correo o usuario ya existe' })
            }
            console.error('Error:', error)
            return res.status(500).json({ error: 'Error en el servidor' })
        }
        
        res.json({ 
            exito: true, 
            mensaje: 'Usuario registrado correctamente',
            usuarioId: resultado.insertId
        })
    })
}

const obtenerUsuarioActual = (req, res) => {
    const { usuarioId } = req.params
    
    const sql = 'SELECT id, nombre, apPaterno, apMaterno, correo, usuario, celular, tipo, publicacionesRestantes, chatsRestantes, puntuacion, totalVotos, bloqueado FROM Usuario WHERE id = ?'
    
    req.db.query(sql, [usuarioId], (error, resultados) => {
        if (error) return res.status(500).json({ error: 'Error en el servidor' })
        if (resultados.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(resultados[0])
    })
}

const actualizarPerfil = (req, res) => {
    const { id, nombre, apPaterno, apMaterno, celular } = req.body
    
    const sql = 'UPDATE Usuario SET nombre = ?, apPaterno = ?, apMaterno = ?, celular = ? WHERE id = ?'
    
    req.db.query(sql, [nombre, apPaterno, apMaterno, celular, id], (error) => {
        if (error) return res.status(500).json({ error: 'Error al actualizar' })
        res.json({ exito: true, mensaje: 'Perfil actualizado' })
    })
}

module.exports = { iniciarSesion, registrar, obtenerUsuarioActual, actualizarPerfil }