// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql = require('mysql2');
// create connection to pool server
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tipjs',
    database: 'shopDEV',
    port: 8811
});
const batchSize = 100000; // adjust batch size
const totalSize = 1000000; // adjust total size
let currentId = 1;
const insertBatch = async () => {
    const values = [];
    console.time('insertBatch::');
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId, name, age, address]);
        currentId++;
    }
    if (!values.length) {
        pool.end((err) => {
            if (err)
                throw err;
            console.log('connection closed');
        });
        return;
    }
    const sql = 'INSERT INTO users (id, name, age, address) VALUES ?';
    pool.query(sql, [values], async (error, results, fields) => {
        if (error)
            throw error;
        console.log(`Inserted ${results.affectedRows} rows`);
        await insertBatch();
    });
    console.timeEnd('insertBatch::');
};
insertBatch().catch(console.error);
// perform a sample operation
// pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
// pool.query('SELECT * FROM users', (error, results, fields) => {
//   if (error) throw error
//   console.log('results: ', results)
// close pool connection
//   pool.end((err) => {
//     if (err) throw err
//     console.log('connection closed')
//   })
// })
