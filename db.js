const mysql = require("mysql");
var con = mysql.createConnection({
  connectionLimit: 50, // default = 10
  host: "localhost",
  user: "paul",
  password: "password",
  database: "bamazonDB"
});

con.connect();
con.end();

module.exports = con;
