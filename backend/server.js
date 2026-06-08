const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const app = express()
app.use(cors())
app.use(express.json())

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'celeste',
    database: 'nexo_inmobiliario'
})

db.connect()

app.listen(3000, () => console.log('Servidor en http://localhost:3000'))