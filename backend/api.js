require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

// Servir archivos estáticos (IMPORTANTE: antes de las rutas)
app.use('/recursos', express.static('recursos'))

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

app.use((req, res, next) => {
    req.db = conexion
    next()
})

// Rutas
app.use('/api', require('./rutas/usuarioRutas'))
app.use('/api/propiedades', require('./rutas/propiedadRutas'))

const puerto = process.env.PUERTO || 3000
app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`)
})