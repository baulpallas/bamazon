const mysql = require("mysql");
const inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  user: "paul",
  password: "password",
  database: "bamazonDB"
});

con.connect();

function managerPrompts() {
  inquirer
    .prompt([
      {
        name: "viewProducts",
        type: "list",
        message: "What would you like to do:  ",
        choices: [
          "View Products for Sale ",
          "View Low Inventory ",
          "Add to Invesntory ",
          "Add New Products",
          "exit"
        ]
      }
    ])
    .then(answers => {
      let item = answers.id;
      let quantity = answers.numUnits;
      con.query(`SELECT * FROM products WHERE item_id = ${item};`, function(
        error,
        results,
        fields
      ) {
        if (error) throw error;
        // resursive logoic if not enough inventory for sale
        if (results[0].stock_quantity < quantity) {
          console.log(
            `There are not enough ${results[0].product_name} to meet your request.  Please try again`
          );
          initialPrompts();
        }
        let newQuantity = results[0].stock_quantity - quantity;

        // logic if stock quanity falls to 0 --> removes item from database
        if (newQuantity === 0) {
          con.query(`DELETE FROM products WHERE item_id = ${item};`, function(
            error,
            results,
            fields
          ) {
            if (error) throw error;
          });
          con.end();
          //logic to update DB with new quantity of item
        } else {
          con.query(
            `UPDATE products SET stockquantity = ${newQuantity} WHERE item_id = ${item};`,
            function(error, results, fields) {
              if (error) throw error;
            }
          );
          con.end();
        }
      });
    });
}
