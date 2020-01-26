const mysql = require("mysql");
const inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  user: "paul",
  password: "password",
  database: "bamazonDB"
});

con.connect();

function initialPrompts() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message:
          "Please enter the product ID of the item that you'd like to purchase:  "
      },
      {
        name: "numUnits",
        type: "input",
        message:
          "Please enter the number of unit's that you'd like to purchase:  "
      }
    ])
    .then(answers => {
      let item = answers.id;
      let quantity = answers.numUnits;

      // mysql query
      connection.query("SELECT 1", function(error, results, fields) {
        if (error) throw error;
        // connected!
      });
      if (answers.guess === this.correctLetter) {
        // Letter(answers.guess);
      } else {
        lives--;
      }
    });
}

con.end();
