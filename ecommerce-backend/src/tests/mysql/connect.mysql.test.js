const mysql = require("mysql2");

// Create connection to Pool Server

const pool = mysql.createPool({
  host: "localhost",
  port: "8811",
  user: "ddhuu",
  password: "123",
  database: "ShopDEV",
});

const batchSize = 100000;
const totalSize = 1_000_000;

let currentId = 1;

console.time("::TIMER::");
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd("::TIMER::");
    pool.end((err) => {
      if (err) {
        console.log(`Error occur while running batch`);
      } else {
        console.log(`Connection pool successfully`);
      }
    });
    return;
  }

  const sql = `insert into test_table (id,name,age,address) VALUES ?`;

  pool.query(sql, [values], async function (err, result) {
    if (err) throw err;
    console.log(`Insert ${result.affectedRows} rows`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);
