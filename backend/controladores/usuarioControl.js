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

// Obtener usuarios con filtros
const obtenerUsuarios = (req, res) => {
    const { tipo, bloqueado, busqueda } = req.query
    let sql = 'SELECT id, nombre, apPaterno, correo, usuario, tipo, bloqueado, fechaPremium, publicacionesRestantes, chatsRestantes FROM Usuario WHERE 1=1'
    const params = []
    
    if (tipo && tipo !== 'todos') {
        sql += ' AND tipo = ?'
        params.push(tipo)
    }
    
    if (bloqueado !== undefined && bloqueado !== 'todos') {
        sql += ' AND bloqueado = ?'
        params.push(bloqueado === 'true')
    }
    
    if (busqueda) {
        sql += ' AND (nombre LIKE ? OR usuario LIKE ? OR correo LIKE ?)'
        const termino = `%${busqueda}%`
        params.push(termino, termino, termino)
    }
    
    sql += ' ORDER BY id DESC'
    
    req.db.query(sql, params, (error, datos) => {
        if (error) return res.status(500).json({ error: error.message })
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

// Obtener propiedades con filtros para reportes
// Obtener propiedades con filtros para reportes
const obtenerPropiedadesReporte = (req, res) => {
    const { categoria, ciudad, vendida, reportada, desde, hasta, busqueda } = req.query
    let sql = `
        SELECT p.*, u.nombre as vendedor, u.usuario 
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
        params.push(vendida === 'true')
    }
    
    if (reportada !== undefined && reportada !== 'todos') {
        sql += ' AND p.reportada = ?'
        params.push(reportada === 'true')
    }
    
    // Búsqueda por texto
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
    
    sql += ' ORDER BY p.id DESC'
    
    req.db.query(sql, params, (error, datos) => {
        if (error) return res.status(500).json({ error: error.message })
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
