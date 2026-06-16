const iniciarSesion = (req, res) => {
    const { correo, password } = req.body
    const sql = 'SELECT id, nombre, apPaterno, apMaterno, correo, usuario, tipo FROM Usuario WHERE (correo = ? OR usuario = ?) AND password = ?'
    
    req.db.query(sql, [correo, correo, password], (error, resultados) => {
        if (error) return res.status(500).json({ error: 'Error en el servidor' })
        if (resultados.length === 0) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
        res.json({ exito: true, usuario: resultados[0] })
    })
}

const registrar = (req, res) => {
    const { nombre, apPaterno, apMaterno, correo, usuario, password, celular } = req.body
    const sql = 'INSERT INTO Usuario (nombre, apPaterno, apMaterno, correo, usuario, password, celular, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, "basico")'
    
    req.db.query(sql, [nombre, apPaterno, apMaterno, correo, usuario, password, celular], (error, resultado) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'El correo o usuario ya existe' })
            return res.status(500).json({ error: error.message })
        }
        res.json({ exito: true, mensaje: 'Usuario registrado correctamente', usuarioId: resultado.insertId })
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

const obtenerUsuarios = (req, res) => {
    const { tipo, bloqueado, busqueda, orden } = req.query
    
    let sql = `
        SELECT u.id, u.nombre, u.apPaterno, u.correo, u.usuario, u.tipo, u.bloqueado, 
               u.fechaPremium, u.publicacionesRestantes, u.chatsRestantes,
               (SELECT COUNT(*) FROM Propiedad WHERE usuarioId = u.id) as totalPublicaciones,
               (SELECT COUNT(*) FROM Propiedad WHERE usuarioId = u.id AND vendida = 1) as totalVendidos
        FROM Usuario u
        WHERE 1=1
    `
    const params = []
    
    if (tipo && tipo !== 'todos') {
        sql += ' AND u.tipo = ?'
        params.push(tipo)
    }
    
    if (bloqueado !== undefined && bloqueado !== 'todos') {
        sql += ' AND u.bloqueado = ?'
        params.push(bloqueado === 'true' ? 1 : 0)
    }
    
    if (busqueda && busqueda.trim()) {
        sql += ' AND (u.nombre LIKE ? OR u.usuario LIKE ? OR u.correo LIKE ?)'
        const termino = `%${busqueda}%`
        params.push(termino, termino, termino)
    }
    
    if (orden === 'publicaciones') {
        sql += ' ORDER BY totalPublicaciones DESC'
    } else if (orden === 'vendidos') {
        sql += ' ORDER BY totalVendidos DESC'
    } else {
        sql += ' ORDER BY u.id DESC'
    }
    
    req.db.query(sql, params, (error, datos) => {
        if (error) {
            console.error('Error en obtenerUsuarios:', error)
            return res.status(500).json({ error: error.message })
        }
        res.json(datos)
    })
}

const toggleBloqueoUsuario = (req, res) => {
    const { id } = req.params
    const { bloquear } = req.body
    
    const sql = 'UPDATE Usuario SET bloqueado = ? WHERE id = ?'
    req.db.query(sql, [bloquear, id], (error, resultado) => {
        if (error) return res.status(500).json({ error: error.message })
        
        if (bloquear) {
            const sqlOcultar = 'UPDATE Propiedad SET oculta = 1 WHERE usuarioId = ? AND oculta = 0'
            req.db.query(sqlOcultar, [id], (err) => {
                if (err) console.error('Error ocultando propiedades:', err)
            })
        } else {
            const sqlMostrar = 'UPDATE Propiedad SET oculta = 0 WHERE usuarioId = ? AND oculta = 1'
            req.db.query(sqlMostrar, [id], (err) => {
                if (err) console.error('Error mostrando propiedades:', err)
            })
        }
        
        res.json({ exito: true, mensaje: bloquear ? 'Usuario bloqueado y propiedades ocultadas' : 'Usuario desbloqueado y propiedades visibles' })
    })
}

module.exports = { 
    iniciarSesion, 
    registrar, 
    obtenerUsuarioActual,
    actualizarPerfil,
    obtenerUsuarios, 
    toggleBloqueoUsuario
}