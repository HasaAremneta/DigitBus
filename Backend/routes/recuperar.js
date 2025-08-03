const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const { connectToDB } = require('../db');
const {enviarCorreoReset} = require('../mailer');


const SECRET_KEY = process.env.SECRET_KEY || 'clave_insegura';// Cambia esto por una clave secreta más segura

// Recuperar contraseña
router.post('/solicitar', async (req, res) => {
    const { correo } = req.body;

    try {
        const pool = await connectToDB();
        const result = await pool.request()
            .input('correo', sql.VarChar, correo)
            .query(`select u.IDUSUARIO, p.NOMBREUSUARIO from PERSONAL p
                    join USUARIOS u on p.NOMBREUSUARIO = u.NOMBREUSUARIO 
                    where p.CORREO = @correo`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Correo no encontrado' });
        }

        const usuario = result.recordset[0].NOMBREUSUARIO;

        //generar token
        const token = jwt.sign({ usuario }, SECRET_KEY, { expiresIn: '15m' });

        await enviarCorreoReset(correo, token);

        res.json({ message: 'Correo de recuperación enviado' });

    } catch (err) {
        console.error('Error al solicitar recuperación de contraseña:', err);
        res.status(500).json({ error: 'Error al solicitar recuperación de contraseña', details: err.message });
    }
})

// Restablecer contraseña
router.post('/restablecer', async (req, res) => {
    const { token, nuevaPassword } = req.body;

    try {
        // Verificar el token
        const decoded = jwt.verify(token, SECRET_KEY);
        const usuario = decoded.usuario;

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

        const pool = await connectToDB();
        await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .input('password', sql.VarChar, hashedPassword)
            .query(`UPDATE USUARIOS SET PASSWORD = @password WHERE NOMBREUSUARIO = @usuario`);

        res.json({ message: 'Contraseña restablecida correctamente' });

    } catch (err) {
        console.error('Error al restablecer la contraseña:', err);
        res.status(500).json({ error: 'Error al restablecer la contraseña', details: err.message });
    }
});

module.exports = router;