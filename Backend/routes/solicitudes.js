const express = require('express');
const router = express.Router();
const {sql, connectToDB} = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/crear', authenticateToken, async (req, res) => {
  const { tipo, observaciones, documentos } = req.body;
  const idUsuario = req.usuario.idUsuario;

  if (!idUsuario) {
    return res.status(400).json({ success: false, message: 'idUsuario no encontrado en el token' });
  }

  try {
    const pool = await connectToDB();

    // Consulta para obtener el idPersonal usando el idUsuario
    const result = await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .query(`
        SELECT p.IDPERSONAL 
        FROM PERSONAL p
        JOIN USUARIOS u ON u.NOMBREUSUARIO = p.NOMBREUSUARIO
        WHERE u.IDUSUARIO = @idUsuario
      `);

    if (result.recordset.length === 0) {
      return res.status(400).json({ success: false, message: 'Usuario no encontrado o no asociado a personal.' });
    }

    const idPersonal = result.recordset[0].IDPERSONAL;

    // Crear la solicitud
    const solicitudResult = await pool.request()
      .input('idPersonal', sql.Int, idPersonal)
      .input('tipoTablet', sql.VarChar(20), tipo)
      .query(`
        INSERT INTO SOLICITUDES (IDPERSONAL, TIPOTABLETA)
        OUTPUT INSERTED.IDSOLICITUD
        VALUES (@idPersonal, @tipoTablet)
      `);

    const idSolicitud = solicitudResult.recordset[0].IDSOLICITUD;

    // Procesar documentos
    const doc = {
      TARJETA: null,
      CONSTANCIA: null,
      VAUCHES: null,
    };

    for (const archivo of documentos) {
      if (archivo.tipo === 'foto') doc.TARJETA = archivo.base64Data;
      else if (archivo.tipo === 'comprobante' || archivo.tipo === 'discapacidad') doc.CONSTANCIA = archivo.base64Data;
      else if (archivo.tipo === 'identificación') doc.VAUCHES = archivo.base64Data;
    }
    
    // Guardar documentos en la base de datos
    await pool.request()
      .input('idSolicitud', sql.Int, idSolicitud)
      .input('tarjetas', sql.Text, doc.TARJETA)
      .input('constancia', sql.Text, doc.CONSTANCIA)
      .input('vauches', sql.Text, doc.VAUCHES)
      .query(`
        INSERT INTO DOCUMENTACION (IDSOLICITUD, TARJETAS, CONSTANCIA, VAUCHES)
        VALUES (@idSolicitud, @tarjetas, @constancia, @vauches)
      `);

    res.status(200).json({ success: true, idSolicitud });

  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ success: false, message: 'Error al crear solicitud' });
  }
});

module.exports = router;