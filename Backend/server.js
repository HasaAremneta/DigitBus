require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.use(cors());
app.use(express.json());

// Rutas
const recuperaciónRoutes = require('./routes/recuperar');
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const renovacionRoutes = require('./routes/renovaciones')
const historialRoutes = require('./routes/historial');
const SolicitudesRoutes = require('./routes/solicitudes');
const RecargasRoutes = require('./routes/recargas');
const PaymentRoutes = require('./routes/payment');

//Enrutamiento 
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recuperar', recuperaciónRoutes);
app.use('/api/renovaciones', renovacionRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/solicitudes', SolicitudesRoutes);
app.use('/api/recargas', RecargasRoutes);
app.use('/api/payment', PaymentRoutes);

//Inicalizacion del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});