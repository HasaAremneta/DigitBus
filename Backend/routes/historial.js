const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { connectToDB } = require('../db');

// Obtener tarjetas por idPersonal
router.get('/tarjetas/:idPersonal', async (req, res) => {
  const idPersonal = parseInt(req.params.idPersonal, 10);
  if (!idPersonal) return res.status(400).json({ error: 'idPersonal es requerido y debe ser número' });

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('idPersonal', sql.Int, idPersonal)
      .query('SELECT * FROM TARJETAS WHERE IDPERSONAL = @idPersonal');

    res.json({ tarjetas: result.recordset });
  } catch (err) {
    console.error('Error al obtener tarjetas:', err);
    res.status(500).json({ error: 'Error al obtener tarjetas', details: err.message });
  }
});

// Obtener recargas por idTarjeta
router.get('/recargas/:idTarjeta', async (req, res) => {
  const idTarjeta = parseInt(req.params.idTarjeta, 10);
  if (!idTarjeta) return res.status(400).json({ error: 'idTarjeta es requerido y debe ser número' });

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('idTarjeta', sql.Int, idTarjeta)
      .query(`
        SELECT r.IDRECARGA, r.IDTARJETA, r.MONTO, r.TIPOTRANSACCION, r.STATUS, r.FECHARECARGA,
               e.NOMBREESTABLECIMIENTO
        FROM RECARGAS r
        LEFT JOIN ESTABLECIMIENTO e ON r.IDESTABLECIMIENTO = e.IDESTABLECIMIENTO
        WHERE r.IDTARJETA = @idTarjeta
        ORDER BY r.FECHARECARGA DESC
      `);

    res.json({ recargas: result.recordset });
  } catch (err) {
    console.error('Error al obtener recargas:', err);
    res.status(500).json({ error: 'Error al obtener recargas', details: err.message });
  }
});

module.exports = router;
