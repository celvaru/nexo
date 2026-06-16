const actualizarUsuariosExpirados = (db) => {
    const sql = `
        UPDATE Usuario 
        SET tipo = 'basico', 
            publicacionesRestantes = 3, 
            chatsRestantes = 5 
        WHERE tipo = 'premium' 
        AND fechaPremium < CURDATE()
    `
    
    db.query(sql, (error, resultado) => {
        if (error) {
            console.error('Error actualizando usuarios expirados:', error)
            return
        }
        if (resultado.affectedRows > 0) {
            console.log(`Usuarios expirados actualizados: ${resultado.affectedRows}`)
        }
    })
}

const actualizarDestacadosExpirados = (db) => {
    const sql = `
        UPDATE Propiedad 
        SET destacada = 0, 
            fechaDestacado = NULL 
        WHERE destacada = 1 
        AND fechaDestacado < CURDATE()
    `
    
    db.query(sql, (error, resultado) => {
        if (error) {
            console.error('Error actualizando destacados:', error)
            return
        }
        if (resultado.affectedRows > 0) {
            console.log(`Destacados expirados removidos: ${resultado.affectedRows}`)
        }
    })
}

// Nuevo: Bloquear usuarios con 3 o más reportes pendientes
const bloquearUsuariosReportados = (db) => {
    const sql = `
        UPDATE Usuario u
        SET u.bloqueado = 1
        WHERE u.id IN (
            SELECT entidadId 
            FROM Reporte 
            WHERE tipo = 'usuario' 
            AND estado = 'pendiente'
            GROUP BY entidadId
            HAVING COUNT(*) >= 3
        )
        AND u.bloqueado = 0
    `
    
    db.query(sql, (error, resultado) => {
        if (error) {
            console.error('Error bloqueando usuarios reportados:', error)
            return
        }
        if (resultado.affectedRows > 0) {
            console.log(`Usuarios bloqueados por reportes: ${resultado.affectedRows}`)
            
            // Ocultar propiedades de los usuarios bloqueados
            const sqlOcultar = `
                UPDATE Propiedad p
                INNER JOIN Usuario u ON p.usuarioId = u.id
                SET p.oculta = 1
                WHERE u.bloqueado = 1 AND p.oculta = 0
            `
            db.query(sqlOcultar, (err, result) => {
                if (err) {
                    console.error('Error ocultando propiedades:', err)
                    return
                }
                if (result.affectedRows > 0) {
                    console.log(`Propiedades ocultadas: ${result.affectedRows}`)
                }
            })
        }
    })
}

// Ejecutar todas las tareas
const ejecutarTareas = (db) => {
    actualizarUsuariosExpirados(db)
    actualizarDestacadosExpirados(db)
    bloquearUsuariosReportados(db)
}

module.exports = { 
    actualizarUsuariosExpirados, 
    actualizarDestacadosExpirados, 
    bloquearUsuariosReportados,
    ejecutarTareas 
}