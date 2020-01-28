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
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Products",
          "exit"
        ]
      }
    ])
    .then(answers => {
      switch (answers.viewProducts) {
        case "View Products for Sale ":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInv();
          break;
        case "Add to Inventory":
          addtoInv();
          break;
        case "Add New Products":
          addNewProducts();
          break;
        case "Exit":
          con.end();
          break;
      }
    });
  con.end();
}

let viewProducts = () => {
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

managerPrompts();
