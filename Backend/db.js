const sql = require('mssql');
//const { use } = require('react');

// Configuración de la conexión a la base de datos
const config = {
    user: 'sa',
    password: 'Hassael24.',
    server: 'DESKTOP-3HJ2A4F', 
    database: 'DigitBus2',
    port: 1433, // Default port for SQL Server
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

async function connectToDB() {
    try {
        const pool = await sql.connect(config);
        return pool;
    }catch (err) {
        console.error('Error al conectar la base de datos:', err);
        throw err;
    }
}

module.exports = {
    sql,
    connectToDB,
};