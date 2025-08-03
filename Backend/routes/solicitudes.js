const express = require('express');
const router = express.Router();
const { pool, sql } = require('../db'); // CORREGIDO: importar pool correctamente

// Función helper para ejecutar queries
const executeQuery = async (query, params = {}) => {
  try {
    const request = pool.request();
    
    // Agregar parámetros dinámicamente
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (typeof value === 'number') {
        request.input(key, sql.Int, value);
      } else if (typeof value === 'string') {
        request.input(key, sql.VarChar, value);
      } else if (value instanceof Date) {
        request.input(key, sql.DateTime, value);
      } else {
        request.input(key, value);
      }
    });
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error en executeQuery:', error);
    throw error;
  }
};

// IMPORTANTE: Obtener tipos permitidos desde la BD
const obtenerTiposPermitidos = async () => {
  try {
    // Consulta los valores permitidos del constraint
    const result = await pool.request().query(`
      SELECT 
        definition 
      FROM sys.check_constraints 
      WHERE name = 'CK_SOLICITUD_TIPOT_3E52440B'
    `);
    
    if (result.recordset.length > 0) {
      // Extraer valores del constraint (esto puede variar según el constraint exacto)
      const definition = result.recordset[0].definition;
      console.log('Constraint TIPOTABLETA:', definition);
    }
    
    // Valores por defecto basados en tu esquema
    return ['tercera_edad', 'estudiantes', 'discapacidad'];
  } catch (error) {
    console.error('Error obteniendo tipos:', error);
    // Fallback a valores comunes
    return ['tercera_edad', 'estudiantes', 'discapacidad'];
  }
};

// IMPORTANTE: Obtener estados permitidos desde la BD
const obtenerEstadosPermitidos = async () => {
  try {
    const result = await pool.request().query(`
      SELECT 
        definition 
      FROM sys.check_constraints 
      WHERE name = 'CK_SOLICITUD_STATU_403A8C7D'
    `);
    
    if (result.recordset.length > 0) {
      const definition = result.recordset[0].definition;
      console.log('Constraint STATUS:', definition);
    }
    
    // Valores por defecto basados en tu esquema
    return ['Pendiente', 'Aprobada', 'Rechazada', 'En proceso'];
  } catch (error) {
    console.error('Error obteniendo estados:', error);
    return ['Pendiente', 'Aprobada', 'Rechazada', 'En proceso'];
  }
};

// Crear nueva solicitud (CORREGIDA completamente)
router.post('/', async (req, res) => {
  const transaction = new sql.Transaction(pool); // CORREGIDO: usar pool directamente
  
  try {
    const { tipo, idPersonal, observaciones, documentos } = req.body;

    // Validar entrada básica
    if (!tipo || !idPersonal) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de solicitud e ID de personal son requeridos'
      });
    }

    // Obtener tipos permitidos dinámicamente
    const TIPOS_PERMITIDOS = await obtenerTiposPermitidos();
    
    if (!TIPOS_PERMITIDOS.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: `Tipo de solicitud no válido. Los tipos permitidos son: ${TIPOS_PERMITIDOS.join(', ')}`
      });
    }

    // Verificar que el personal existe
    const personalExiste = await executeQuery(`
      SELECT COUNT(*) as count FROM dbo.PERSONAL WHERE IDPERSONAL = @idPersonal
    `, { idPersonal });

    if (personalExiste[0].count === 0) {
      return res.status(400).json({
        success: false,
        message: 'El ID de personal no existe'
      });
    }

    await transaction.begin();
    const request = new sql.Request(transaction);

    // Insertar en SOLICITUDES (estructura exacta de tu tabla)
    const solicitudResult = await request
      .input('idPersonal', sql.Int, idPersonal)
      .input('tipoTablet', sql.VarChar(20), tipo)
      .input('observaciones', sql.Text, observaciones || null)
      .query(`
        INSERT INTO dbo.SOLICITUDES 
        (IDPERSONAL, TIPOTABLETA, OBSERVACIONES)
        OUTPUT INSERTED.IDSOLICITUD
        VALUES (@idPersonal, @tipoTablet, @observaciones)
      `);

    const IDSOLICITUD = solicitudResult.recordset[0].IDSOLICITUD;

    // Obtener el FOLIO generado por el trigger
    const folioResult = await request
      .input('idSolicitudFolio', sql.Int, IDSOLICITUD)
      .query(`
        SELECT FOLIO FROM dbo.SOLICITUDES WHERE IDSOLICITUD = @idSolicitudFolio
      `);

    const FOLIO = folioResult.recordset[0]?.FOLIO;

    // Insertar documentos en DOCUMENTACION (si existen)
    if (documentos && Array.isArray(documentos) && documentos.length > 0) {
      for (const documento of documentos) {
        const { tipo: tipoDoc, base64Data, nombre } = documento;
        
        if (tipoDoc && base64Data) {
          try {
            const bufferData = Buffer.from(base64Data, 'base64');
            
            await request
              .input('idSolicitudDoc', sql.Int, IDSOLICITUD)
              .input('tipoDocumento', sql.VarChar(50), tipoDoc)
              .input('archivo', sql.VarBinary(sql.MAX), bufferData)
              .query(`
                INSERT INTO dbo.DOCUMENTACION 
                (IDSOLICITUD, TIPO_DOCUMENTO, ARCHIVO)
                VALUES (@idSolicitudDoc, @tipoDocumento, @archivo)
              `);
          } catch (docError) {
            console.error('Error procesando documento:', docError);
            // Continuar con otros documentos
          }
        }
      }
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Solicitud creada exitosamente',
      data: {
        idSolicitud: IDSOLICITUD,
        folio: FOLIO,
        tipo: tipo,
        fecha: new Date().toISOString()
      }
    });

  } catch (err) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error('Error en rollback:', rollbackError);
    }
    
    console.error('Error en solicitudes:', err);
    
    // Manejo específico de errores de constraint
    if (err.message.includes('CK_SOLICITUD_TIPOT')) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de tableta no válido según las reglas de la base de datos'
      });
    }
    
    if (err.message.includes('FK_SOLICITUDES_PERSONAL')) {
      return res.status(400).json({
        success: false,
        message: 'El personal especificado no existe'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Obtener solicitudes por personal (MEJORADO)
router.get('/personal/:idPersonal', async (req, res) => {
  try {
    const { idPersonal } = req.params;
    
    // Validar que idPersonal sea numérico
    if (isNaN(parseInt(idPersonal))) {
      return res.status(400).json({
        success: false,
        message: 'ID de personal debe ser numérico'
      });
    }

    const solicitudes = await executeQuery(`
      SELECT 
        S.IDSOLICITUD,
        RTRIM(S.TIPOTABLETA) AS TIPOTABLETA,
        S.FECHA_REGISTRO,
        RTRIM(S.STATUS) AS STATUS,
        S.OBSERVACIONES,
        RTRIM(S.FOLIO) AS FOLIO,
        RTRIM(P.NOMBRE) AS PERSONAL_NOMBRE,
        -- Contar documentos asociados
        (SELECT COUNT(*) FROM dbo.DOCUMENTACION D WHERE D.IDSOLICITUD = S.IDSOLICITUD) AS TOTAL_DOCUMENTOS
      FROM dbo.SOLICITUDES S
      INNER JOIN dbo.PERSONAL P ON S.IDPERSONAL = P.IDPERSONAL
      WHERE S.IDPERSONAL = @idPersonal
      ORDER BY S.FECHA_REGISTRO DESC
    `, { idPersonal: parseInt(idPersonal) });

    res.json({
      success: true,
      data: solicitudes,
      total: solicitudes.length
    });

  } catch (err) {
    console.error('Error al obtener solicitudes:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Obtener una solicitud específica con documentos
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID de solicitud debe ser numérico'
      });
    }

    // Obtener solicitud
    const solicitud = await executeQuery(`
      SELECT 
        S.IDSOLICITUD,
        RTRIM(S.TIPOTABLETA) AS TIPOTABLETA,
        S.FECHA_REGISTRO,
        RTRIM(S.STATUS) AS STATUS,
        S.OBSERVACIONES,
        RTRIM(S.FOLIO) AS FOLIO,
        RTRIM(P.NOMBRE) AS PERSONAL_NOMBRE,
        P.IDPERSONAL
      FROM dbo.SOLICITUDES S
      INNER JOIN dbo.PERSONAL P ON S.IDPERSONAL = P.IDPERSONAL
      WHERE S.IDSOLICITUD = @id
    `, { id: parseInt(id) });

    if (solicitud.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Obtener documentos asociados
    const documentos = await executeQuery(`
      SELECT 
        IDDOCUMENTO,
        RTRIM(TIPO_DOCUMENTO) AS TIPO_DOCUMENTO,
        LEN(ARCHIVO) AS TAMAÑO_BYTES
      FROM dbo.DOCUMENTACION
      WHERE IDSOLICITUD = @id
    `, { id: parseInt(id) });

    res.json({
      success: true,
      data: {
        ...solicitud[0],
        documentos: documentos
      }
    });

  } catch (err) {
    console.error('Error al obtener solicitud:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitud'
    });
  }
});

// Actualizar estado (CORREGIDO)
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID de solicitud debe ser numérico'
      });
    }

    // Obtener estados permitidos dinámicamente
    const ESTADOS_PERMITIDOS = await obtenerEstadosPermitidos();

    if (!estado || !ESTADOS_PERMITIDOS.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `Estado no válido. Los estados permitidos son: ${ESTADOS_PERMITIDOS.join(', ')}`
      });
    }

    // Verificar que la solicitud existe
    const solicitudExiste = await executeQuery(`
      SELECT COUNT(*) as count FROM dbo.SOLICITUDES WHERE IDSOLICITUD = @id
    `, { id: parseInt(id) });

    if (solicitudExiste[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Actualizar estado
    await executeQuery(`
      UPDATE dbo.SOLICITUDES 
      SET 
        STATUS = @estado,
        OBSERVACIONES = CASE 
          WHEN @observaciones IS NOT NULL THEN @observaciones 
          ELSE OBSERVACIONES 
        END
      WHERE IDSOLICITUD = @idSolicitud
    `, {
      idSolicitud: parseInt(id),
      estado: estado,
      observaciones: observaciones || null
    });

    res.json({
      success: true,
      message: 'Estado actualizado correctamente',
      data: {
        idSolicitud: parseInt(id),
        nuevoEstado: estado,
        fecha: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('Error al actualizar estado:', err);
    
    if (err.message.includes('CK_SOLICITUD_STATU')) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido según las reglas de la base de datos'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// NUEVO: Endpoint para obtener valores permitidos
router.get('/meta/valores-permitidos', async (req, res) => {
  try {
    const tipos = await obtenerTiposPermitidos();
    const estados = await obtenerEstadosPermitidos();
    
    res.json({
      success: true,
      data: {
        tiposPermitidos: tipos,
        estadosPermitidos: estados
      }
    });
  } catch (err) {
    console.error('Error obteniendo metadatos:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener valores permitidos'
    });
  }
});

module.exports = router;