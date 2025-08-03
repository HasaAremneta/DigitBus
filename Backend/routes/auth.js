const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDB } = require('../db');

//const SECRET_KEY = 'your_secret_key'; // Cambia esto por una clave secreta más segura

//lOGIN
router.post('/login', async (req, res) => {
    const { NombreUsuario, password } = req.body;

    try {
        const pool = await connectToDB();
        const result = await pool.request()
            .input('NombreUsuario', sql.NVarChar, NombreUsuario)
            .query(`
                SELECT 
                    u.IDUSUARIO, 
                    u.PASSWORD AS passwordHash, 
                    p.IDPERSONAL, 
                    p.NOMBRE 
                FROM USUARIOS u 
                JOIN PERSONAL p ON u.NOMBREUSUARIO = p.NOMBREUSUARIO 
                WHERE u.NOMBREUSUARIO = @nombreUsuario
            `);

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        if (!user.passwordHash) {
            console.error('Contraseña en base de datos es null o undefined');
            return res.status(500).json({ error: 'Error interno en el servidor' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { idUsuario: user.IDUSUARIO, idPersonal: user.IDPERSONAL, nombre: user.NOMBRE },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Inicio de sesión exitoso', token });

    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: 'Error al iniciar sesión', details: err.message });
    }
});


module.exports = router;