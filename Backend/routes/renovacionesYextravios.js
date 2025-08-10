// routes/renovaciones.js
const express = require('express');
const router = express.Router();
const { sql, connectToDB } = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');

// idPersonal debe estar en el token
async function getPersonal(pool, idPersonal) {
  const result = await pool.request()
    .input('idPersonal', sql.Int, idPersonal)
    .query(`
      SELECT p.IDPERSONAL
      FROM dbo.PERSONAL p
      JOIN dbo.USUARIOS u ON u.NOMBREUSUARIO = p.NOMBREUSUARIO
      WHERE p.IDPERSONAL = @idPersonal
    `);
  return result.recordset.length > 0;
}

// Renovación es para estudiantes
router.post('/renovacion', authenticateToken, async (req, res) => {
  const { tipo, observaciones, documentos = [] } = req.body;
  const idPersonal = req.usuario?.idPersonal;

  if (!idPersonal) return res.status(400).json({ success:false, message:'idUsuario no encontrado en el token' });

  try {
    const pool = await connectToDB();

    const okPersonal = await getPersonal(pool, idPersonal);
    if (!okPersonal) return res.status(400).json({ success:false, message:'Personal no encontrado' });

    if (tipo !== 'ESTUDIANTE') {
      return res.status(400).json({ success:false, message:'La renovación solo aplica a Estudiante' });
    }

    const solicitudResult = await pool.request()
      .input('idPersonal', sql.Int, idPersonal)
      .input('tipoTablet', sql.VarChar(20), tipo) 
      .input('fechaSolicitud', sql.DateTime, new Date())
      .input('status', sql.VarChar(20), 'Pendiente')
      .input('tipoSolicitud', sql.VarChar(20), 'Renovación')
      .query(`
        INSERT INTO dbo.SOLICITUDES (IDPERSONAL, TIPOTABLETA, FECHASOLICITUD, STATUS, TIPOSOLICITUD)
        OUTPUT INSERTED.IDSOLICITUD
        VALUES (@idPersonal, @tipoTablet, @fechaSolicitud, @status, @tipoSolicitud)
      `);

    const idSolicitud = solicitudResult.recordset[0].IDSOLICITUD;

    // Procesar documentos
    const doc = { TARJETAS: null, CONSTANCIA: null, VAUCHES: null };
    for (const a of documentos) {
      if (a.tipo === 'comprobante') doc.CONSTANCIA = a.base64Data;
      if (a.tipo === 'foto') doc.TARJETAS = a.base64Data;           
      if (a.tipo === 'identificacion') doc.VAUCHES = a.base64Data;   
    }

    await pool.request()
      .input('idSolicitud', sql.Int, idSolicitud)
      .input('tarjetas', sql.VarChar(sql.MAX), doc.TARJETAS)
      .input('constancia', sql.VarChar(sql.MAX), doc.CONSTANCIA)
      .input('vauches', sql.VarChar(sql.MAX), doc.VAUCHES)
      .query(`
        INSERT INTO dbo.DOCUMENTACION (IDSOLICITUD, TARJETAS, CONSTANCIA, VAUCHES)
        VALUES (@idSolicitud, @tarjetas, @constancia, @vauches)
      `);

    return res.status(200).json({ success:true, idSolicitud });
  } catch (err) {
    console.error('Error al crear la solicitud de renovación:', err);
    return res.status(500).json({ success:false, message:'Error al crear la solicitud de renovación', details: err.message });
  }
});

//Extravío es para estudiantes, tercera edad, etc. es lo mismo que el modulo de solicitudes
router.post('/extravios', authenticateToken, async (req, res) => {
  const { tipo, observaciones, documentos = [] } = req.body;
  const idPersonal = req.usuario?.idPersonal;

  if (!idPersonal) return res.status(400).json({ success:false, message:'idUsuario no encontrado en el token' });

  try {
    const pool = await connectToDB();

    const okPersonal = await getPersonal(pool, idPersonal);
    if (!okPersonal) return res.status(400).json({ success:false, message:'Personal no encontrado' });

    const solicitudResult = await pool.request()
      .input('idPersonal', sql.Int, idPersonal)
      .input('tipoTablet', sql.VarChar(20), tipo) // puede ser ESTUDIANTE, TERCERA_EDAD, etc.
      .input('fechaSolicitud', sql.DateTime, new Date())
      .input('status', sql.VarChar(20), 'Pendiente')
      .input('tipoSolicitud', sql.VarChar(20), 'Extravío')
      .query(`
        INSERT INTO dbo.SOLICITUDES (IDPERSONAL, TIPOTABLETA, FECHASOLICITUD, STATUS, TIPOSOLICITUD)
        OUTPUT INSERTED.IDSOLICITUD
        VALUES (@idPersonal, @tipoTablet, @fechaSolicitud, @status, @tipoSolicitud)
      `);

    const idSolicitud = solicitudResult.recordset[0].IDSOLICITUD;

    // Mapeo igual que ya usabas
    const doc = { TARJETAS: null, CONSTANCIA: null, VAUCHES: null };
    for (const a of documentos) {
      if (a.tipo === 'foto') doc.TARJETAS = a.base64Data;
      else if (a.tipo === 'comprobante' || a.tipo === 'discapacidad') doc.CONSTANCIA = a.base64Data;
      else if (a.tipo === 'identificacion') doc.VAUCHES = a.base64Data; // sin acento
    }

    await pool.request()
      .input('idSolicitud', sql.Int, idSolicitud)
      .input('tarjetas', sql.VarChar(sql.MAX), doc.TARJETAS)
      .input('constancia', sql.VarChar(sql.MAX), doc.CONSTANCIA)
      .input('vauches', sql.VarChar(sql.MAX), doc.VAUCHES)
      .query(`
        INSERT INTO dbo.DOCUMENTACION (IDSOLICITUD, TARJETAS, CONSTANCIA, VAUCHES)
        VALUES (@idSolicitud, @tarjetas, @constancia, @vauches)
      `);

    return res.status(200).json({ success:true, idSolicitud });
  } catch (err) {
    console.error('Error en extravíos:', err);
    return res.status(500).json({ success:false, message:'Error al crear solicitud de extravío', details: err.message });
  }
});


// Obtener tarjetas del usuario
router.get('/tarjetas/:idPersonal', authenticateToken, async (req, res) => {
  const { idPersonal } = req.params;

  try {
    const pool = await connectToDB();

    const result = await pool.request()
      .input('idPersonal', sql.Int, idPersonal)
      .query(`
        SELECT 
          t.IDTARJETA,
          t.NUMTARJETA,
          t.FECHAEMISION,
          t.FECHAVECIMIENTO,
          t.STATUS,
          t.TIPO
        FROM dbo.TARJETAS t
        WHERE t.IDPERSONAL = @idPersonal
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron tarjetas para esta persona' });
    }

    return res.status(200).json({ success: true, tarjetas: result.recordset });

  } catch (err) {
    console.error('Error al obtener tarjetas:', err);
    return res.status(500).json({ success: false, message: 'Error al obtener tarjetas', details: err.message });
  }
});


module.exports = router;
