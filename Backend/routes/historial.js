const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { connectToDB } = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');
const Stripe = require('stripe');
const API_KEY = process.env.API_KEY;


const stripe = new Stripe(API_KEY);

// Obtener historial completo (recargas, renovaciones, solicitudes)
/*router.get('/', authenticateToken, async (req, res) => {
    const idUsuario = req.usuario.idUsuario;// Obtener ID de usuario del token
    try {
        const pool = await connectToDB();
        console.log("Usuario desde token:", req.usuario);
        
        // Consulta para obtener recargas y renovaciones (de la tabla RECARGAS)
        const recargas = await pool.request()
        .input('idUsuario', sql.Int, idUsuario)
        .query(
            ` SELECT r.IDRECARGA, r.IDTARJETA, t.NUMTARJETA,
                       r.MONTO, r.TIPOTRANSACCION, r.STATUS, r.FECHARECARGA,
                       e.NOMBREESTABLECIMIENTO,
                       p.NOMBRE + ' ' + p.APELLIDOPATERNO AS NOMBREPERSONAL
                FROM RECARGAS r
                JOIN TARJETAS t ON r.IDTARJETA = t.IDTARJETA
                JOIN ESTABLECIMIENTO e ON r.IDESTABLECIMIENTO = e.IDESTABLECIMIENTO
                JOIN PERSONAL p ON t.IDPERSONAL = p.IDPERSONAL
                JOIN USUARIOS u ON u.NOMBREUSUARIO = p.NOMBREUSUARIO
                WHERE u.IDUSUARIO = @idUsuario
                ORDER BY r.FECHARECARGA DESC`
        );
        console.log("Recargas obtenidas:", recargas.recordset);

        // Consulta para obtener solicitudes
        const solicitudes = await pool.request()
        .input('idUsuario', sql.Int, idUsuario)
        .query(
            `SELECT s.IDSOLICITUD, s.IDPERSONAL,
                       p.NOMBRE + ' ' + p.APELLIDOPATERNO AS NOMBREPERSONAL,
                       s.TIPOTABLETA, s.FECHASOLICITUD, s.STATUS
                FROM SOLICITUDES s
                JOIN PERSONAL p ON s.IDPERSONAL = p.IDPERSONAL
                JOIN USUARIOS u ON u.NOMBREUSUARIO = p.NOMBREUSUARIO
                WHERE u.IDUSUARIO = @idUsuario
                ORDER BY s.FECHASOLICITUD DESC`
        );

        res.json({
            recargas: recargas.recordset,
            solicitudes: solicitudes.recordset
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Error al obtener el historial', 
            details: err.message 
        });
    }
});*/

router.get('/', async (req, res) => {
    const sessions = await stripe.checkout.sessions.list({
        limit: 3,
        customer_details: {
            email: 'mariogt367@gmail.com',
            //name: 'Mario Zuñiga'
        },
    });
    res.json(sessions);
});



// Obtener historial por ID de tarjeta
router.get('/tarjeta/:idTarjeta', async (req, res) => {
    const { idTarjeta } = req.params;

    try {
        const pool = await connectToDB();

        // Historial de recargas/renovaciones para una tarjeta específica
        const recargas = await pool.request()
            .input('idTarjeta', sql.Int, idTarjeta)
            .query(
                `SELECT r.IDRECARGA, r.MONTO, r.TIPOTRANSACCION, r.STATUS, r.FECHARECARGA,
                       e.NOMBREESTABLECIMIENTO
                FROM RECARGAS r
                JOIN ESTABLECIMIENTO e ON r.IDESTABLECIMIENTO = e.IDESTABLECIMIENTO
                WHERE r.IDTARJETA = @idTarjeta
                ORDER BY r.FECHARECARGA DESC`
            );

        // Información de la tarjeta
        const tarjeta = await pool.request()
            .input('idTarjeta', sql.Int, idTarjeta)
            .query(
                `SELECT t.*, p.NOMBRE, p.APELLIDOPATERNO, p.APELLIDOMATERNO
                FROM TARJETAS t
                JOIN PERSONAL p ON t.IDPERSONAL = p.IDPERSONAL
                WHERE t.IDTARJETA = @idTarjeta`
            );

        res.json({
            tarjeta: tarjeta.recordset[0],
            historial: recargas.recordset
        });
    } catch (err) {
        res.status(500).json({
            error: 'Error al obtener el historial de la tarjeta',
            details: err.message
        });
    }
});

module.exports = router;