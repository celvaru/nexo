require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

// Servir archivos estáticos
app.use('/recursos', express.static('recursos'))

// Conexión a MySQL
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NOMBRE
})

conexion.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err)
        return
    }
    console.log('Conectado a MySQL')
})

// Middleware para pasar la conexión a las rutas
app.use((req, res, next) => {
    req.db = conexion
    next()
})

// Tareas automáticas
const { ejecutarTareas } = require('./controladores/tareasControl')

// Ejecutar tareas automáticas cada hora
setInterval(() => {
    console.log('Ejecutando tareas automáticas...')
    ejecutarTareas(conexion)
}, 3600000)

// Ejecutar al inicio
setTimeout(() => {
    console.log('Ejecutando tareas automáticas al inicio...')
    ejecutarTareas(conexion)
}, 5000)

// Rutas
app.use('/api', require('./rutas/usuarioRutas'))
app.use('/api/propiedades', require('./rutas/propiedadRutas'))
app.use('/api/favoritos', require('./rutas/favoritoRutas'))

const puerto = process.env.PUERTO || 3000
app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`)
})