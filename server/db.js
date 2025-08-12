

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sports'
});


connection.connect((err) => {
  if (err) {
    console.error('❌ Could not connect to database:', err.message);
  } else {
    console.log('✅ Connected to MySQL (dummy connection)');
  }
});

connection.query('SELECT * FROM dummy_table', (err, results) => {
  if (err) {
    console.error('Query error:', err.message);
  } else {
    console.log('Query results:', results);
  }
});


connection.end();
