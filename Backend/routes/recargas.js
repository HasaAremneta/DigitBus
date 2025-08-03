const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// POST /api/recargas - Crear nueva recarga
router.post('/', async (req, res) => {
  const { idTarjeta, monto } = req.body;
  const idUsuario = req.usuario?.id || 1; // Temporal hasta que tengas auth

  try {
    // 1. Verificar propiedad de la tarjeta
    const tarjetaValida = await pool.query`
      SELECT T.IDTIPOBENEFICIO 
      FROM TARJETAS T
      JOIN USUARIOS U ON T.IDUSUARIO = U.IDUSUARIO
      WHERE T.IDTARJETA = ${idTarjeta} AND U.IDUSUARIO = ${idUsuario}
    `;
    
    if (tarjetaValida.recordset.length === 0) {
      return res.status(403).json({ ok: false, message: 'Tarjeta no válida' });
    }

    // 2. Verificar que existe un establecimiento válido
    const establecimiento = await pool.query`
      SELECT TOP 1 IDESTABLECIMIENTO 
      FROM ESTABLECIMIENTOS 
      WHERE ACTIVO = 1 OR ACTIVO = 'true' OR ACTIVO = 'ACTIVO'
    `;

    if (establecimiento.recordset.length === 0) {
      return res.status(400).json({ ok: false, message: 'No hay establecimientos disponibles' });
    }

    const idEstablecimiento = establecimiento.recordset[0].IDESTABLECIMIENTO;

    // 3. Calcular descuento según beneficio
    const idTipoBeneficio = tarjetaValida.recordset[0].IDTIPOBENEFICIO;
    let descuento = 0;

    if (idTipoBeneficio) {
      const beneficio = await pool.query`
        SELECT NOMBRE FROM TIPOS_BENEFICIO 
        WHERE IDTIPOBENEFICIO = ${idTipoBeneficio} 
        AND (ACTIVO = 1 OR ACTIVO = 'true' OR ACTIVO = 'ACTIVO' OR ACTIVO = '1')
      `;
      
      if (beneficio.recordset.length > 0) {
        const nombreBeneficio = beneficio.recordset[0].NOMBRE;
        if (nombreBeneficio === 'Estudiantes') descuento = monto * 0.10;
        else if (nombreBeneficio === 'Personas de la tercera edad') descuento = monto * 0.15;
        else if (nombreBeneficio === 'Personas con discapacidad') descuento = monto * 0.20;
      }
    }

    const montoFinal = monto - descuento;

    // 4. Registrar recarga
    const result = await pool.query`
      INSERT INTO RECARGAS (
        IDTARJETA,
        IDESTABLECIMIENTO,
        MONTO,
        TIPOTRANSACCION,
        STATUS,
        REGERAOR,
        FECHARECARGA
      )
      VALUES (
        ${idTarjeta},
        ${idEstablecimiento},
        ${parseFloat(monto).toFixed(2)},
        'RECARGA',
        'COMPLETADA',
        'APP_RECARGA_' + CONVERT(varchar, ${idUsuario}),
        GETDATE()
      );
      SELECT SCOPE_IDENTITY() AS idRecarga;
    `;

    // 4.1. ✅ Actualizar saldo de la tarjeta
    await pool.query`
      UPDATE TARJETAS
      SET SALDO = ISNULL(SALDO, 0) + ${montoFinal}
      WHERE IDTARJETA = ${idTarjeta}
    `;

    // 5. Respuesta
    res.json({
      ok: true,
      recarga: {
        id: result.recordset[0].idRecarga,
        monto: parseFloat(monto),
        descuento: parseFloat(descuento.toFixed(2)),
        montoFinal: parseFloat(montoFinal.toFixed(2)),
        fecha: new Date().toISOString(),
        establecimiento: idEstablecimiento
      }
    });

  } catch (error) {
    console.error('Error en recarga:', error);
    res.status(500).json({ 
      ok: false, 
      message: 'Error al procesar la recarga',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/recargas/tarjeta/:idTarjeta - Obtener recargas de una tarjeta
router.get('/tarjeta/:idTarjeta', async (req, res) => {
  const { idTarjeta } = req.params;
  const idUsuario = req.usuario?.id || 1;

  try {
    const tarjetaValida = await pool.query`
      SELECT 1 FROM TARJETAS T
      JOIN USUARIOS U ON T.IDUSUARIO = U.IDUSUARIO
      WHERE T.IDTARJETA = ${idTarjeta} AND U.IDUSUARIO = ${idUsuario}
    `;

    if (tarjetaValida.recordset.length === 0) {
      return res.status(403).json({ ok: false, message: 'Tarjeta no válida' });
    }

    const recargas = await pool.query`
      SELECT 
        R.IDRECARGA,
        CAST(R.MONTO AS DECIMAL(10,2)) AS MONTO,
        R.FECHARECARGA,
        RTRIM(R.STATUS) AS STATUS,
        RTRIM(R.TIPOTRANSACCION) AS TIPOTRANSACCION,
        RTRIM(R.REGERAOR) AS REGERAOR,
        RTRIM(TB.NOMBRE) AS TIPO_BENEFICIO,
        E.NOMBRE AS ESTABLECIMIENTO
      FROM RECARGAS R
      LEFT JOIN TARJETAS T ON R.IDTARJETA = T.IDTARJETA
      LEFT JOIN TIPOS_BENEFICIO TB ON T.IDTIPOBENEFICIO = TB.IDTIPOBENEFICIO
      LEFT JOIN ESTABLECIMIENTOS E ON R.IDESTABLECIMIENTO = E.IDESTABLECIMIENTO
      WHERE R.IDTARJETA = ${idTarjeta}
      ORDER BY R.FECHARECARGA DESC
    `;

    res.json({ 
      ok: true, 
      recargas: recargas.recordset.map(recarga => ({
        ...recarga,
        MONTO: parseFloat(recarga.MONTO)
      }))
    });
  } catch (error) {
    console.error('Error obteniendo recargas:', error);
    res.status(500).json({ 
      ok: false, 
      message: 'Error al obtener recargas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/recargas/beneficios - Obtener lista de beneficios
router.get('/beneficios', async (req, res) => {
  try {
    const beneficios = await pool.query`
      SELECT 
        IDTIPOBENEFICIO AS id,
        RTRIM(NOMBRE) AS nombre,
        RTRIM(DESCRIPCION) AS descripcion
      FROM TIPOS_BENEFICIO
      WHERE ACTIVO = '1' OR ACTIVO = 'true' OR ACTIVO = 'ACTIVO' OR ACTIVO = 1
    `;
    
    res.json({ 
      ok: true, 
      beneficios: beneficios.recordset 
    });
  } catch (error) {
    console.error('Error obteniendo beneficios:', error);
    res.status(500).json({ 
      ok: false, 
      message: 'Error al obtener beneficios',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/recargas/validar/esquema - Validar esquema de BD
router.get('/validar/esquema', async (req, res) => {
  try {
    const validaciones = await pool.query`
      SELECT 
        (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'RECARGAS') AS tabla_recargas,
        (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ESTABLECIMIENTOS') AS tabla_establecimientos,
        (SELECT COUNT(*) FROM ESTABLECIMIENTOS WHERE ACTIVO = 1 OR ACTIVO = 'true') AS establecimientos_activos,
        (SELECT COUNT(*) FROM TIPOS_BENEFICIO WHERE ACTIVO = 1 OR ACTIVO = 'true') AS beneficios_activos
    `;

    const resultado = validaciones.recordset[0];
    
    res.json({
      ok: true,
      esquema: {
        tablas_existen: resultado.tabla_recargas > 0 && resultado.tabla_establecimientos > 0,
        establecimientos_disponibles: resultado.establecimientos_activos,
        beneficios_disponibles: resultado.beneficios_activos,
        listo_para_operaciones: resultado.tabla_recargas > 0 && resultado.establecimientos_activos > 0
      }
    });
  } catch (error) {
    console.error('Error validando esquema:', error);
    res.status(500).json({ 
      ok: false, 
      message: 'Error al validar esquema de base de datos' 
    });
  }
});

// ✅ Exportar rutas
module.exports = router;
