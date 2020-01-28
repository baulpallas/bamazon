const mysql = require("mysql");
const inquirer = require("inquirer");

// var con = mysql.createConnection({
//   connectionLimit: 50, // default = 10
//   host: "localhost",
//   user: "paul",
//   password: "password",
//   database: "bamazonDB"
// });

var con = mysql.createConnection({
  host: "localhost",
  user: "paul",
  password: "password",
  database: "bamazonDB"
});
con.connect();

let firstQuestion = () => {
  con.query("SELECT * FROM products;", function(error, results, fields) {
    for (let i = 0; i < results.length; i++) {
      if (error) throw error;
      console.log(
        "\nItem ID: " +
          results[i].item_id +
          " || Product Name: " +
          results[i].product_name +
          " || Price: " +
          results[i].price +
          " || Stock Quantity: " +
          results[i].stock_quantity +
          "\n"
      );
    }
  });
};

firstQuestion();
function initialPrompts() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Please enter the ID of the item you'd like to purchase:  "
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
            `UPDATE products SET stock_quantity = ${newQuantity} WHERE item_id = ${item};`,
            function(error, results, fields) {
              if (error) throw error;
            }
          );
          con.end();
        }
      });
    });
}

initialPrompts();
