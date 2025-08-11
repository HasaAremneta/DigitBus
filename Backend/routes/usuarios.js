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
      .query('SELECT 1 FROM USUARIOS WHERE NOMBREUSUARIO = @NombreUsuario');

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


router.get('/tarjetasU/:idPersonal', async (req, res) => {
  const { idPersonal } = req.params;
  const pool = await connectToDB();
  const tarjetas = await pool.request()
    .input('IDUsuario', sql.VarChar, idPersonal)
    .query('SELECT * FROM TARJETAS WHERE IDPERSONAL = @IDUsuario');

  res.json(tarjetas);
});

router.post('/nuevaTarjeta', async (req, res) => {
  const { idPersonal, numTarjeta, tipo } = req.body;

  try {
    const pool = await connectToDB();

    const fechaEmision = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 4);

    await pool.request()
      .input('IDPERSONAL', sql.Int, idPersonal)
      .input('TIPO', sql.VarChar, tipo)
      .input('NUMTARJETA', sql.VarChar, numTarjeta)
      .input('FECHAEMISION', sql.DateTime, fechaEmision)
      .input('FECHAVENCIMIENTO', sql.DateTime, fechaVencimiento)
      .query(`
        INSERT INTO TARJETAS (IDPERSONAL, TIPO, NUMTARJETA, FECHAEMISION, FECHAVECIMIENTO, SALDO, STATUS) 
        VALUES (@IDPERSONAL, @TIPO, @NUMTARJETA, @FECHAEMISION, @FECHAVENCIMIENTO, 0, 'ACTIVA')
      `);

    res.status(201).json({ success: true, message: 'Tarjeta creada correctamente' });

  } catch (err) {
    console.error('Error al crear tarjeta:', err);
    res.status(500).json({ success: false, message: 'Error al crear tarjeta', details: err.message });
  }
});



router.delete('/eliminarTarjeta/:idTarjeta', async (req, res) => {
  const { idTarjeta } = req.params;

  try {
    const pool = await connectToDB();

    const result = await pool.request()
      .input('IDTARJETA', sql.Int, idTarjeta)
      .query(`DELETE FROM TARJETAS WHERE IDTARJETA = @IDTARJETA`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Tarjeta no encontrada' });
    }

    res.json({ success: true, message: 'Tarjeta eliminada correctamente' });

  } catch (err) {
    console.error('Error al eliminar tarjeta:', err);
    res.status(500).json({ success: false, message: 'Error al eliminar tarjeta', details: err.message });
  }
});

router.post('/validaPassword', async (req, res) => {
  const { nombre, password } = req.body;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .query('SELECT PASSWORD FROM USUARIOS WHERE NOMBREUSUARIO = @nombre');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const hash = result.recordset[0].PASSWORD;
    const isValid = await bcrypt.compare(password, hash);

    res.json({ valid: isValid });

  } catch (err) {
    console.error('Error al validar contraseña:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});


router.patch('/actualizarDatosPerfil', async (req, res) => {
  const { nombreUsuarioActual, nuevoNombreUsuario, correo } = req.body;

  if (!nombreUsuarioActual) {
    return res.status(400).json({ error: 'Falta el nombre de usuario actual' });
  }

  try {
    const pool = await connectToDB();
    const resultPersonal = await pool.request()
      .input('nuevoNombreUsuario', sql.VarChar, nuevoNombreUsuario || nombreUsuarioActual)
      .input('correo', sql.VarChar, correo)
      .input('nombreUsuarioActual', sql.VarChar, nombreUsuarioActual)
      .query(`
        UPDATE PERSONAL
        SET NOMBREUSUARIO = @nuevoNombreUsuario,
            CORREO = @correo
        WHERE NOMBREUSUARIO = @nombreUsuarioActual
      `);

    const resultUsuarios = await pool.request()
      .input('nuevoNombreUsuario', sql.VarChar, nuevoNombreUsuario || nombreUsuarioActual)
      .input('nombreUsuarioActual', sql.VarChar, nombreUsuarioActual)
      .query(`
        UPDATE USUARIOS
        SET NOMBREUSUARIO = @nuevoNombreUsuario
        WHERE NOMBREUSUARIO = @nombreUsuarioActual
      `);

    if (resultPersonal.rowsAffected[0] === 0 || resultUsuarios.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Datos actualizados correctamente' });
  } catch (error) {
    console.error('Error actualizando datos de perfil:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar datos de perfil' });
  }
});


router.patch('/actualizarPassword', async (req, res) => {
  const { nombreUsuario, nuevaPassword } = req.body;

  if (!nombreUsuario || !nuevaPassword || nuevaPassword.trim() === '') {
    return res.status(400).json({ error: 'Faltan datos para actualizar la contraseña' });
  }

  try {
    const pool = await connectToDB();
    const hashed = await bcrypt.hash(nuevaPassword, 10);

    const result = await pool.request()
      .input('password', sql.VarChar, hashed)
      .input('nombreUsuario', sql.VarChar, nombreUsuario)
      .query(`
        UPDATE USUARIOS
        SET PASSWORD = @password
        WHERE NOMBREUSUARIO = @nombreUsuario
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error actualizando contraseña:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar contraseña' });
  }
});





module.exports = router;
