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

const obtenerEstadisticas = (req, res) => {
    const sqls = {
        totalUsuarios: 'SELECT COUNT(*) as total FROM Usuario',
        usuariosPremium: 'SELECT COUNT(*) as total FROM Usuario WHERE tipo = "premium"',
        usuariosBasicos: 'SELECT COUNT(*) as total FROM Usuario WHERE tipo = "basico"',
        usuariosBloqueados: 'SELECT COUNT(*) as total FROM Usuario WHERE bloqueado = TRUE',
        totalPropiedades: 'SELECT COUNT(*) as total FROM Propiedad',
        propiedadesDestacadas: 'SELECT COUNT(*) as total FROM Propiedad WHERE destacada = TRUE',
        propiedadesVendidas: 'SELECT COUNT(*) as total FROM Propiedad WHERE vendida = TRUE',
        propiedadesReportadas: 'SELECT COUNT(*) as total FROM Propiedad WHERE reportada = TRUE',
        ingresosPremium: 'SELECT SUM(monto) as total FROM PagoPremium WHERE estado = "activo"'
    }
    
    const resultados = {}
    let consultasPendientes = Object.keys(sqls).length
    
    for (const [key, sql] of Object.entries(sqls)) {
        req.db.query(sql, (error, datos) => {
            if (error) {
                console.error(`Error en ${key}:`, error)
                resultados[key] = { total: 0 }
            } else {
                resultados[key] = datos[0]
            }
            
            consultasPendientes--
            if (consultasPendientes === 0) {
                res.json(resultados)
            }
        })
    }
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
    
    // Ordenamiento
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

// Bloquear/Desbloquear usuario
const toggleBloqueoUsuario = (req, res) => {
    const { id } = req.params
    const { bloquear } = req.body
    
    const sql = 'UPDATE Usuario SET bloqueado = ? WHERE id = ?'
    req.db.query(sql, [bloquear, id], (error, resultado) => {
        if (error) return res.status(500).json({ error: error.message })
        res.json({ exito: true, mensaje: bloquear ? 'Usuario bloqueado' : 'Usuario desbloqueado' })
    })
}
const obtenerPropiedadesReporte = (req, res) => {
    const { categoria, ciudad, vendida, reportada, oculta, desde, hasta, busqueda, orden } = req.query
    
    let sql = `
        SELECT p.*, u.nombre as vendedor, u.usuario,
               (SELECT COUNT(*) FROM Voto WHERE usuarioId = u.id AND tipo = 'positivo') as votos
        FROM Propiedad p
        INNER JOIN Usuario u ON p.usuarioId = u.id
        WHERE 1=1
    `
    const params = []
    
    if (categoria && categoria !== 'todos') {
        sql += ' AND p.categoria = ?'
        params.push(categoria)
    }
    
    if (ciudad && ciudad !== 'todas') {
        sql += ' AND p.ciudad = ?'
        params.push(ciudad)
    }
    
    if (vendida !== undefined && vendida !== 'todos') {
        sql += ' AND p.vendida = ?'
        params.push(vendida === 'true' ? 1 : 0)
    }
    
    if (reportada !== undefined && reportada !== 'todos') {
        sql += ' AND p.reportada = ?'
        params.push(reportada === 'true' ? 1 : 0)
    }
    
    if (oculta !== undefined && oculta !== 'todos') {
        sql += ' AND p.oculta = ?'
        params.push(oculta === 'true' ? 1 : 0)
    }
    
    if (busqueda && busqueda.trim()) {
        sql += ' AND (p.titulo LIKE ? OR u.nombre LIKE ? OR u.usuario LIKE ?)'
        const termino = `%${busqueda}%`
        params.push(termino, termino, termino)
    }
    
    if (desde) {
        sql += ' AND p.precio >= ?'
        params.push(desde)
    }
    
    if (hasta) {
        sql += ' AND p.precio <= ?'
        params.push(hasta)
    }
    
    // Ordenamiento
    if (orden === 'precio_asc') {
        sql += ' ORDER BY p.precio ASC'
    } else if (orden === 'precio_desc') {
        sql += ' ORDER BY p.precio DESC'
    } else if (orden === 'votos_desc') {
        sql += ' ORDER BY votos DESC'
    } else if (orden === 'categoria') {
        sql += ' ORDER BY p.categoria ASC'
    } else {
        sql += ' ORDER BY p.id DESC'
    }
    
    req.db.query(sql, params, (error, datos) => {
        if (error) {
            console.error('Error en obtenerPropiedadesReporte:', error)
            return res.status(500).json({ error: error.message })
        }
        res.json(datos)
    })
}

// Marcar propiedad como vendida/oculta
const togglePropiedadEstado = (req, res) => {
    const { id } = req.params
    const { vendida, oculta } = req.body
    
    const sql = 'UPDATE Propiedad SET vendida = ?, oculta = ? WHERE id = ?'
    req.db.query(sql, [vendida || false, oculta || false, id], (error, resultado) => {
        if (error) return res.status(500).json({ error: error.message })
        res.json({ exito: true })
    })
}

module.exports = { 
    iniciarSesion, 
    registrar, 
    obtenerEstadisticas, 
    obtenerUsuarios, 
    toggleBloqueoUsuario,
    obtenerPropiedadesReporte,
    togglePropiedadEstado
}
