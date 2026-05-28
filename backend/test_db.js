require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=yes;`;

async function testConnection() {
    try {
        console.log('Connecting to:', connectionString);
        let pool = new sql.ConnectionPool({
            connectionString: connectionString
        });
        await pool.connect();
        console.log('Connected successfully!');
        let result = await pool.request().query('SELECT * FROM Resins');
        console.log('Rows:', result.recordset.length);
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}
testConnection();
