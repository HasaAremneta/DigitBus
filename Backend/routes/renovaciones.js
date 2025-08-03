const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { connectToDB } = require('../db');

// Obtener todas las renovaciones
router.get('/', async (req, res) => {
    try {
        const pool = await connectToDB();
        // Consulta que une las tablas Tarjetas y Solicitudes para obtener información completa
        const result = await pool.request().query(`
            SELECT t.IDTARJETA, t.NUMTARJETA, t.FECHAEMISION, t.FECHAVECIMIENTO, t.STATUS,
                   s.IDSOLICITUD, s.TIPOTABLETA, s.FECHASOLICITUD, s.STATUS AS ESTADOSOLICITUD,
                   p.IDPERSONAL, p.NOMBRE, p.APELLIDOPATERNO, p.APELLIDOMATERNO
            FROM TARJETAS t
            JOIN SOLICITUDES s ON t.IDSOLICITUD = s.IDSOLICITUD
            JOIN PERSONAL p ON t.IDPERSONAL = p.IDPERSONAL
            ORDER BY t.FECHAVECIMIENTO DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las renovaciones', details: err.message });
    }
});

// Crear una nueva renovación (actualizar tarjeta existente)
router.post('/', async (req, res) => {
    const { 
        idTarjeta, 
        nuevaFechaVencimiento,
        idPersonal // ID del personal que realiza la renovación
    } = req.body;

    try {
        const pool = await connectToDB();
        
        // 1. Verificar que la tarjeta existe
        const tarjeta = await pool.request()
            .input('idTarjeta', sql.Int, idTarjeta)
            .query('SELECT * FROM TARJETAS WHERE IDTARJETA = @idTarjeta');
        
        if (tarjeta.recordset.length === 0) {
            return res.status(404).json({ error: 'Tarjeta no encontrada' });
        }

        // 2. Actualizar la tarjeta con la nueva fecha de vencimiento
        await pool.request()
            .input('idTarjeta', sql.Int, idTarjeta)
            .input('nuevaFechaVencimiento', sql.Date, nuevaFechaVencimiento)
            .query('UPDATE TARJETAS SET FECHAVECIMIENTO = @nuevaFechaVencimiento WHERE IDTARJETA = @idTarjeta');

        // 3. Registrar la renovación en RECARGAS (podría ser una tabla específica para renovaciones)
        await pool.request()
            .input('idTarjeta', sql.Int, idTarjeta)
            .input('idPersonal', sql.Int, idPersonal)
            .input('fechaRenovacion', sql.DateTime, new Date())
            .query(`
                INSERT INTO RECARGAS (IDTARJETA, IDESTABLECIMIENTO, MONTO, TIPOTRANSACCION, STATUS, FECHARECARGA)
                VALUES (@idTarjeta, 1, 0, 'RENOVACION', 'COMPLETADO', @fechaRenovacion)
            `);

        res.status(200).json({ message: 'Tarjeta renovada exitosamente' });
    } catch (err) {
        res.status(500).json({ 
            error: 'Error al renovar la tarjeta', 
            details: err.message 
        });
    }
});

module.exports = router;