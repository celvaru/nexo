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

const obtenerPropiedadesReporte = (req, res) => {
    const { categoria, ciudad, vendida, reportada, oculta, desde, hasta, busqueda, orden } = req.query
    
    let sql = `
        SELECT p.*, 
               u.nombre as vendedor, 
               u.usuario,
               (SELECT COUNT(*) FROM Favorito WHERE propiedadId = p.id) as totalFavoritos
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
    } else if (orden === 'favoritos_desc') {
        sql += ' ORDER BY totalFavoritos DESC'
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

module.exports = { obtenerEstadisticas, obtenerPropiedadesReporte }