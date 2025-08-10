const sql = require('mssql');
//const { use } = require('react');

// Configuración de la conexión a la base de datos
const config = {
    user: 'sa',
    password: 'Gatitofeliz1$',
    server: 'DESKTOP-81P4IMG', 
    database: 'DIGITBUS',
    //port: 1434, // Default port for SQL Server
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

const pool = new sql.ConnectionPool(config);

const poolConnect = pool.connect();

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
    pool,
    poolConnect,
};