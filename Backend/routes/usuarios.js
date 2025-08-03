const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sql = require('mssql');
const { connectToDB } = require('../db');

// Registro
router.post('/registro', async (req, res) => {
  const {
    NombreUsuario,
    Nombre,
    ApellidoPaterno,
    ApellidoMaterno,
    DiaNacimiento,
    MesNacimiento,
    AnoNacimiento,
    Correo,
    password
  } = req.body;

  try {
        const FechaNacimiento = `${AnoNacimiento}-${MesNacimiento.padStart(2, '0')}-${DiaNacimiento.padStart(2, '0')}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = await connectToDB();

        // Verificar si el nombre de usuario ya existe
        const usuarioExistente = await pool.request()
            .input('NombreUsuario', sql.VarChar, NombreUsuario)
            .query('SELECT 1 FROM USUARIOS WHERE NOMBREUSUARIO = @nombreUsuario');

        if (usuarioExistente.recordset.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        // Insertar en PERSONAL
        await pool.request()
        .input('nombreUsuario', sql.VarChar, NombreUsuario)
        .input('nombre', sql.VarChar, Nombre)
        .input('apellidoPaterno', sql.VarChar, ApellidoPaterno)
        .input('apellidoMaterno', sql.VarChar, ApellidoMaterno)
        .input('fechaNacimiento', sql.Date, FechaNacimiento)
        .input('correo', sql.VarChar, Correo)
        .query(`INSERT INTO PERSONAL (NOMBREUSUARIO, NOMBRE, APELLIDOPATERNO, APELLIDOMATERNO, FECHANACIMIENTO, CORREO)
                VALUES (@nombreUsuario, @nombre, @apellidoPaterno, @apellidoMaterno, @fechaNacimiento, @correo)`);

        // Insertar en USUARIOS
        await pool.request()
        .input('nombreUsuario', sql.VarChar, NombreUsuario)
        .input('password', sql.VarChar, hashedPassword)
        .query(`INSERT INTO USUARIOS (NOMBREUSUARIO, PASSWORD) VALUES (@nombreUsuario, @password)`);

        res.status(201).json({ message: 'Usuario registrado correctamente' });
        } catch (err) {
            res.status(500).json({
            error: 'Error al registrar el usuario',
            details: err.message
    });
  }
});

module.exports = router;
